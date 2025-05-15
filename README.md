# Kalmovis (Rive-Nex)

موقع لعرض الأفلام والمسلسلات مبني باستخدام Next.js و TypeScript.

## نظرة عامة

يهدف هذا المشروع إلى توفير واجهة مستخدم سهلة وسريعة لتصفح ومشاهدة الأفلام والمسلسلات مع معلومات تفصيلية عنها.

## التقنيات المستخدمة

- Next.js
- TypeScript
- React
- Sass/SCSS
- TMDB API (لبيانات الأفلام والمسلسلات)
- Firebase (للمصادقة وبعض الميزات الإضافية)

## إعداد المشروع محليًا

1.  **نسخ المستودع:**

    ```bash
    git clone https://github.com/mohibalkal/kalmovis.git
    cd kalmovis
    ```

2.  **تثبيت الاعتماديات:**
    يوصى باستخدام `pnpm`:

    ```bash
    pnpm install
    ```

    أو يمكنك استخدام `npm` أو `yarn`:

    ```bash
    npm install
    # أو
    yarn install
    ```

3.  **إعداد متغيرات البيئة:**

    - قم بنسخ ملف `.env.example` إلى ملف جديد باسم `.env.local`.
    - املأ المتغيرات المطلوبة في `.env.local` مثل مفاتيح TMDB API وإعدادات Firebase.

4.  **تشغيل خادم التطوير:**
    ```bash
    pnpm dev
    # أو
    npm run dev
    # أو
    yarn dev
    ```
    سيتم تشغيل الموقع عادةً على `http://localhost:3000`.

## النشر

سيتم نشر هذا المشروع على Netlify.

## المساهمة

إذا كنت ترغب في المساهمة، يرجى الاطلاع على المشكلات المفتوحة (Issues) أو اقتراح تحسينات جديدة.
