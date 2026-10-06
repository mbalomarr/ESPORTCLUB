<%@ WebHandler Language="C#" Class="RegisterHandler" %>
<%@ Assembly Name="System.Web.Extensions, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" %>

// PMU E-Sports Club: registration endpoint.
// Receives the JSON sent by the "Join the Club" form in index.html, validates it,
// and saves it into dbo.ClubMembers (see database_setup.sql).
//
// Requirements on MonsterASP: the site must run on ASP.NET 4.x (.NET Framework).
// This file is compiled automatically by IIS (no build step). It deliberately uses
// C# 5 syntax only, because that is what the on-the-fly compiler supports.
//
// Responses (always JSON):
//   201 { "success": true }
//   400 { "success": false, "error": "validation", "fields": ["email", ...] }
//   409 { "success": false, "error": "duplicate" }        (student ID already registered)
//   405 / 413 / 415 / 500 { "success": false, "error": "<code>" }

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;

public class RegisterHandler : IHttpHandler
{
    private const string ConnectionName = "MonsterASP_DB_Connection";
    private const int MaxBodyBytes = 8 * 1024;

    // Allowed values of the "Study year" dropdown (the values, not the Arabic labels).
    private static readonly HashSet<string> StudyYears = new HashSet<string>(StringComparer.Ordinal)
    {
        "Foundation", "Freshman", "Sophomore", "Junior", "Senior", "Graduate"
    };

    private static readonly Regex StudentIdPattern = new Regex(@"^[0-9]{6,12}$", RegexOptions.Compiled);
    private static readonly Regex EmailPattern = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);
    private static readonly Regex PhonePattern = new Regex(@"^\+?[0-9][0-9 \-]{6,18}$", RegexOptions.Compiled);

    public bool IsReusable
    {
        get { return true; }
    }

    public void ProcessRequest(HttpContext context)
    {
        HttpRequest request = context.Request;
        HttpResponse response = context.Response;
        response.ContentType = "application/json";
        response.ContentEncoding = Encoding.UTF8;
        response.Cache.SetCacheability(HttpCacheability.NoCache);
        response.TrySkipIisCustomErrors = true; // keep our JSON instead of IIS error pages

        if (!string.Equals(request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
        {
            response.AppendHeader("Allow", "POST");
            Fail(context, 405, "method_not_allowed");
            return;
        }

        if (request.ContentType == null || !request.ContentType.StartsWith("application/json", StringComparison.OrdinalIgnoreCase))
        {
            Fail(context, 415, "unsupported_media_type");
            return;
        }

        if (request.ContentLength > MaxBodyBytes)
        {
            Fail(context, 413, "payload_too_large");
            return;
        }

        Dictionary<string, object> data;
        try
        {
            string body;
            using (StreamReader reader = new StreamReader(request.InputStream, Encoding.UTF8))
            {
                body = reader.ReadToEnd();
            }
            if (body.Length > MaxBodyBytes)
            {
                Fail(context, 413, "payload_too_large");
                return;
            }
            data = new JavaScriptSerializer().Deserialize<Dictionary<string, object>>(body);
        }
        catch (Exception)
        {
            data = null;
        }
        if (data == null)
        {
            Fail(context, 400, "invalid_json");
            return;
        }

        // Spam trap: real visitors never fill the hidden "_gotcha" field.
        // Pretend success so bots don't learn they were blocked.
        if (Field(data, "_gotcha").Length > 0)
        {
            Respond(context, 201, Payload(true, null));
            return;
        }

        string fullName = Field(data, "fullName");
        string studentId = Field(data, "studentId");
        string email = Field(data, "email");
        string phone = Field(data, "phone");
        string major = Field(data, "major");
        string studyYear = Field(data, "year");

        List<string> invalid = new List<string>();
        if (fullName.Length < 2 || fullName.Length > 100) invalid.Add("fullName");
        if (!StudentIdPattern.IsMatch(studentId)) invalid.Add("studentId");
        if (email.Length > 254 || !EmailPattern.IsMatch(email)) invalid.Add("email");
        if (!PhonePattern.IsMatch(phone)) invalid.Add("phone");
        if (major.Length < 2 || major.Length > 100) invalid.Add("major");
        if (!StudyYears.Contains(studyYear)) invalid.Add("year");

        if (invalid.Count > 0)
        {
            Dictionary<string, object> payload = Payload(false, "validation");
            payload["fields"] = invalid;
            Respond(context, 400, payload);
            return;
        }

        ConnectionStringSettings connection = ConfigurationManager.ConnectionStrings[ConnectionName];
        if (connection == null || string.IsNullOrWhiteSpace(connection.ConnectionString) || connection.ConnectionString.Contains("YOUR_"))
        {
            Fail(context, 500, "not_configured");
            return;
        }

        const string sql =
            "INSERT INTO dbo.ClubMembers (FullName, StudentID, Email, Phone, Major, StudyYear) " +
            "VALUES (@FullName, @StudentID, @Email, @Phone, @Major, @StudyYear);";

        try
        {
            using (SqlConnection db = new SqlConnection(connection.ConnectionString))
            using (SqlCommand command = new SqlCommand(sql, db))
            {
                // Parameterized values: user input is never concatenated into the SQL text.
                command.Parameters.Add("@FullName", SqlDbType.NVarChar, 100).Value = fullName;
                command.Parameters.Add("@StudentID", SqlDbType.NVarChar, 20).Value = studentId;
                command.Parameters.Add("@Email", SqlDbType.NVarChar, 254).Value = email.ToLowerInvariant();
                command.Parameters.Add("@Phone", SqlDbType.NVarChar, 20).Value = phone;
                command.Parameters.Add("@Major", SqlDbType.NVarChar, 100).Value = major;
                command.Parameters.Add("@StudyYear", SqlDbType.NVarChar, 20).Value = studyYear;

                db.Open();
                command.ExecuteNonQuery();
            }
        }
        catch (SqlException ex)
        {
            // 2627 / 2601 = unique constraint violation (student ID already registered).
            if (ex.Number == 2627 || ex.Number == 2601)
            {
                Fail(context, 409, "duplicate");
                return;
            }
            Fail(context, 500, "database_error");
            return;
        }
        catch (Exception)
        {
            Fail(context, 500, "server_error");
            return;
        }

        Respond(context, 201, Payload(true, null));
    }

    /// <summary>Trimmed text value of a JSON field ("" when missing).</summary>
    private static string Field(Dictionary<string, object> data, string key)
    {
        object value;
        if (!data.TryGetValue(key, out value) || value == null) return "";
        return Convert.ToString(value).Trim();
    }

    private static Dictionary<string, object> Payload(bool success, string error)
    {
        Dictionary<string, object> payload = new Dictionary<string, object>();
        payload["success"] = success;
        if (error != null) payload["error"] = error;
        return payload;
    }

    private static void Fail(HttpContext context, int status, string error)
    {
        Respond(context, status, Payload(false, error));
    }

    private static void Respond(HttpContext context, int status, Dictionary<string, object> payload)
    {
        context.Response.StatusCode = status;
        context.Response.Write(new JavaScriptSerializer().Serialize(payload));
    }
}
