/* =====================================================================
   PMU E-Sports Club: registration database
   Run this ONCE in the MonsterASP database (e.g. in the control panel's
   SQL query tool or SQL Server Management Studio).
   Safe to run again: it only creates what doesn't exist yet.

   Do NOT upload this file to wwwroot; it is only needed to set up the database.
   ===================================================================== */

IF OBJECT_ID(N'dbo.ClubMembers', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ClubMembers
    (
        Id               INT IDENTITY(1,1) NOT NULL,
        FullName         NVARCHAR(100)     NOT NULL,   -- NVARCHAR stores Arabic names correctly
        StudentID        NVARCHAR(20)      NOT NULL,
        Email            NVARCHAR(254)     NOT NULL,
        Phone            NVARCHAR(20)      NOT NULL,
        Major            NVARCHAR(100)     NOT NULL,
        StudyYear        NVARCHAR(20)      NOT NULL,
        RegistrationDate DATETIME2(0)      NOT NULL
            CONSTRAINT DF_ClubMembers_RegistrationDate DEFAULT (GETDATE()),

        CONSTRAINT PK_ClubMembers PRIMARY KEY CLUSTERED (Id),
        -- One registration per student; register.ashx reports duplicates as "already registered".
        CONSTRAINT UQ_ClubMembers_StudentID UNIQUE (StudentID)
    );
END;
GO

/* ---------------------------------------------------------------------
   Useful queries for the club admins
   --------------------------------------------------------------------- */

-- All registrations, newest first:
-- SELECT Id, FullName, StudentID, Email, Phone, Major, StudyYear, RegistrationDate
-- FROM dbo.ClubMembers
-- ORDER BY RegistrationDate DESC;

-- Number of members per study year:
-- SELECT StudyYear, COUNT(*) AS Members FROM dbo.ClubMembers GROUP BY StudyYear ORDER BY Members DESC;

-- Remove one registration (replace 123 with the Id):
-- DELETE FROM dbo.ClubMembers WHERE Id = 123;
