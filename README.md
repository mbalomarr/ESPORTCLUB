# نادي PMU للرياضات الإلكترونية | PMU E-Sports Club

الموقع الرسمي لنادي الرياضات الإلكترونية في جامعة الأمير محمد بن فهد.
الموقع كله في ملف واحد: **`index.html`**، والصور في مجلد **`assets`**. تسجيلات الطلاب تُحفظ في قاعدة بيانات **SQL Server** على MonsterASP عبر الملف `register.ashx`.

- **النشر على MonsterASP:** راجع ملف [`MONSTERASP_DEPLOYMENT.md`](MONSTERASP_DEPLOYMENT.md)
- **معاينة مباشرة على الإنترنت:** <https://mbalomarr.github.io/ESPORTCLUB/> (تتحدّث تلقائيًا بعد كل تعديل على GitHub). ⚠ نموذج التسجيل **لا يعمل** في هذه المعاينة لأنها لا تحتوي على خادم؛ يعمل فقط على MonsterASP.

---

## دليل التعديل (للأستاذ)

### كيف أعدّل ملفًا على GitHub؟
1. افتح الملف `index.html` على GitHub.
2. اضغط أيقونة القلم ✏️ (أعلى اليمين).
3. استخدم البحث (**Ctrl + F** أو **⌘ + F**) للوصول إلى القسم المطلوب، مثلًا ابحث عن `EVENT` أو `MEMBER`.
4. بعد التعديل اضغط **«Commit changes…»** ثم **«Commit changes»**.
5. ارفع `index.html` الجديد إلى MonsterASP (راجع دليل النشر).

### القاعدة الذهبية: كل نص له نسختان
```html
<span class="en">Valorant Fall Cup</span><span class="ar">كأس الخريف لفالورانت</span>
```
- عدّل النص **بين** `>` و `<` فقط.
- `class="en"` يظهر عند اختيار **EN**، و `class="ar"` يظهر عند اختيار **ع**.
- لا تحذف علامات `<span ...>` و `</span>`.

### ➕ إضافة فعالية
ابحث عن `▼▼▼ EVENT ▼▼▼`. انسخ الكتلة كاملة من `<!-- ▼▼▼ EVENT ▼▼▼ -->` إلى `<!-- ▲▲▲ END EVENT ▲▲▲ -->` والصقها تحتها، ثم عدّل:

| ما تعدّله | مثال | ملاحظة |
|---|---|---|
| `data-status="..."` | `upcoming` | `upcoming` قادمة، `live` مباشر، `completed` منتهية |
| `data-date="..."` | `2026-12-10` | السنة-الشهر-اليوم بالأرقام الإنجليزية |
| `<p class="event-game">` | `Valorant` | اسم اللعبة |
| العنوان والوصف والمكان والجائزة | | النسخة الإنجليزية والعربية |
| `<li class="i-clock" dir="ltr">` | `18:00` | الوقت (احذف السطر إن لم يوجد) |

- **ترتيب الفعاليات تلقائي** (المباشرة أولًا، ثم القادمة حسب التاريخ، ثم السابقة)، والتاريخ والحالة يُكتبان على البطاقة تلقائيًا.
- بعد انتهاء الفعالية غيّر `upcoming` إلى `completed` فتنتقل إلى «السابقة» ويختفي زر التسجيل.
- لإضافة صورة للفعالية ضع داخل `<div class="event-cover">` السطر: `<img src="https://رابط-الصورة.jpg" alt="">`

### 👤 إضافة عضو إلى المجلس
ابحث عن `▼▼▼ MEMBER ▼▼▼`، انسخ الكتلة كاملة والصقها في المكان الذي تريد أن يظهر فيه العضو، ثم عدّل المنصب والاسم والتخصص واللعبة.
- **الصورة (اختياري):** ارفع صورة مربعة إلى مجلد `assets/roster` ثم ضع داخل `<div class="member-photo">` السطر:
  `<img src="assets/roster/اسم-الملف.jpg" alt="">`
- بدون صورة يظهر أول حرفين من الاسم الإنجليزي تلقائيًا.
- لحذف عضو احذف كتلته كاملة.

### 🤝 الرعاة (Clix)
ابحث عن `▼▼▼ SPONSOR ▼▼▼`. لإظهار شعار الراعي ارفع الشعار إلى مجلد `assets`، ثم استبدل النص `CLIX` بالسطر:
`<img src="assets/clix-logo.png" alt="Clix" class="h-14 w-auto">`
واستبدل `href="#"` برابط موقع الراعي.

### ✏️ نصوص أخرى
- **الأرقام** (عدد الأعضاء، البطولات…): ابحث عن `150+` أو عن `Club numbers`.
- **الرؤية ومحاور النادي:** في قسم `ABOUT`.
- **روابط التواصل والبريد:** في قسم `FOOTER` (ابحث عن `Social links`).

### ⚠ تجنّب هذه الأخطاء
- لا تحذف علامات `<` أو `>` أو علامات التنصيص `"`.
- انسخ الكتلة **كاملة** من سطر `▼▼▼` إلى سطر `▲▲▲`.
- إذا ظهر شيء غريب بعد التعديل: افتح الملف على GitHub ← **History** (أيقونة الساعة) ← اختر النسخة السابقة لاسترجاعها. لا يضيع أي شيء.

### 📝 التسجيل في النادي
نموذج «انضم إلى النادي» يرسل الحقول الستة (الاسم، الرقم الجامعي، البريد، الجوال، التخصص، السنة الدراسية) إلى `register.ashx`، الذي يتحقق منها ثم يحفظها في جدول **`ClubMembers`**.
كل رقم جامعي يُسجَّل مرة واحدة فقط. طريقة إعداد قاعدة البيانات وعرض التسجيلات موجودة في [`MONSTERASP_DEPLOYMENT.md`](MONSTERASP_DEPLOYMENT.md).

---

## For developers (English)

- **Stack:** a single static `index.html`. Tailwind CSS v4 runs from a CDN (`@tailwindcss/browser`), fonts come from Google Fonts, and a small inline script at the end of the file handles the EN/AR switch, dark/light theme, mobile menu, event dates, sorting and filters, member initials, and the registration submission. No build step, no dependencies.
- **Registration backend:** the form POSTs JSON (`fullName`, `studentId`, `email`, `phone`, `major`, `year`) to `register.ashx`, an ASP.NET 4.x generic handler compiled on the fly by IIS (C# 5 syntax, `JavaScriptSerializer`, no NuGet). It validates input server-side, runs a parameterized `INSERT` into `dbo.ClubMembers` (schema in `database_setup.sql`, with a unique `StudentID`) and replies with JSON: `201 {success:true}`, `400 {error:"validation", fields:[…]}`, `409 {error:"duplicate"}`, or `405/413/415/500 {error:"…"}`.
- **Configuration:** `web.config` holds the `MonsterASP_DB_Connection` connection string as a **placeholder**. Real credentials are entered on the server only and must never be committed. It also sets `index.html` as the default document and blocks `.sql`/`.md` downloads.
- **Assets:** `assets/` holds the logo (`logo-transparent.png` for the UI, `logo.png` for social previews), `icon.png` / `apple-icon.png`, and `roster/` for member photos. All paths are relative, so the site works from any folder or domain.
- **Bilingual content:** text is written as `<span class="en">…</span><span class="ar">…</span>`. CSS hides the inactive language based on `<html lang>`. Attributes use `data-label-en/ar`, `data-placeholder-en/ar` and `<option data-en/ar>`.
- **Preferences:** `localStorage` keys `pmu-lang` and `theme`, applied by an inline script in `<head>` before first paint.
- **Hosting:** production is MonsterASP (IIS, ASP.NET 4.x); see `MONSTERASP_DEPLOYMENT.md`. `.github/workflows/deploy.yml` also publishes `index.html` and `assets/` to GitHub Pages as a static preview on every push (registration can't work there: no server).
- **Local preview:** open `index.html` directly in a browser, or serve the folder with any static server.
