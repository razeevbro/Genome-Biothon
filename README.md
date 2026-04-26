# 🍛 DietSathi - Your Nepali Nutrition Companion

DietSathi is an AI-powered, culturally contextual nutrition tracking and meal-planning platform specifically tailored for the Nepali demographic. Built for high performance and clinical safety, it generates dynamic, mathematically precise meal plans using local ingredients.

## 🎯 The Problem
Despite the growing awareness of health and fitness, individuals consuming traditional Nepali diets lack accurate, culturally relevant tools to track their nutritional intake. Existing market-leading platforms predominantly feature Western cuisines, provide generic one-size-fits-all recommendations, and fail to engage users effectively. This makes it exceptionally difficult for the Nepali demographic to accurately track meals, stay motivated, and achieve personalized health goals.

## 💡 The Solution
DietSathi bridges this gap by providing a localized, AI-powered nutrition planner. By integrating an authentic Nepali food database, dynamic weight-scaled AI diet generation, robust BMI monitoring, and gamified progress tracking, DietSathi empowers users with a highly personalized, culturally relevant, and engaging health-tracking experience.

## ✨ Key Features
- **🇳🇵 Authentic Local Database:** A curated database of Nepali and regional foods (e.g., Kodo ko Dhido, Gundruk, Chiura).
- **🧠 Hybrid AI Generation:** Uses deterministic clinical logic (Mifflin-St Jeor Equation) for safe macro-calculation, combined with **Google Gemini Flash** for empathetic, personalized meal summaries.
- **🏥 Clinical Edge-Case Handling:** Strict medical constraints algorithm. If a user selects too many conflicting conditions (e.g., Diabetes + Gastritis + PCOS + Uric Acid), the system halts and refers them to a clinical dietitian instead of hallucinating a dangerous meal plan.
- **📊 Robust Tracking & Gamification:** Monitor streaks, BMI (Metric & Imperial), and daily macro targets.
- **💾 Cloud Persistence:** Save generated meal plans securely to the cloud using **Supabase**.

## 🛠️ Tech Stack
- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend/API:** Next.js Serverless Routes
- **Database:** Supabase (PostgreSQL)
- **AI Integration:** Google Generative AI (Gemini Flash API)

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```
Add your keys to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Database Setup (Supabase)
To populate the Nepali food database for the "Log Meal" dropdown, run this SQL query in your Supabase SQL Editor:
```sql
INSERT INTO public.food_items (name, unit_type, calories_per_unit, protein_per_unit, carbs_per_unit, fats_per_unit) VALUES
('Chiya (No Sugar) + 2 Boiled Eggs', 'serving', 250, 12, 31, 8),
('Kalo Chiya + 2 Ushineko Aloo (Boiled Potatoes)', 'serving', 300, 4, 38, 10),
('Tsampa (Roasted Barley Flour) Porridge', 'serving', 350, 10, 44, 12),
('Sel Roti (1 pc) + Chiya + Apple', 'serving', 400, 5, 50, 13),
('Oats with Buffalo Milk and Bananas', 'serving', 450, 15, 56, 15),
('Sprouted Moong Dal Chat', 'serving', 200, 14, 25, 7),
('Brown Rice + Dal + Saag + Kukhura ko Jhol', 'serving', 600, 35, 75, 20),
('Kodo ko Dhido + Sisnu (Nettle Soup) + Local Beans', 'serving', 550, 18, 69, 18),
('White Rice + Fish Curry (Macha ko Jhol) + Rayo ko Saag', 'serving', 650, 30, 81, 22),
('Phapar ko Dhido (Buckwheat) + Ghee + Kukhura ko Masu', 'serving', 750, 40, 94, 25),
('White Rice + Daal + Gundruk Sadeko', 'serving', 500, 12, 63, 17),
('Vegetable Jaulo (Soft Rice and Lentils) with Ghee', 'serving', 450, 14, 56, 15),
('Roasted Bhatmas (Soybeans) Sadeko', 'serving', 250, 18, 31, 8),
('Makkai Bhuteko (Roasted Corn)', 'serving', 200, 6, 25, 7),
('Chhoila with Chiura', 'serving', 400, 25, 50, 13),
('Chana (Chickpeas) Chatpate', 'serving', 300, 12, 38, 10),
('Aloo Sadeko (Spicy Potato) + Black Tea', 'serving', 250, 3, 31, 8),
('Boiled Eggs and Soft Fruits (Banana/Papaya)', 'serving', 200, 12, 25, 7),
('Sugar-free Almonds & Walnuts + Green Tea', 'serving', 220, 8, 28, 7),
('Roti (2 pcs) + Aloo Tama', 'serving', 400, 8, 50, 13),
('Phapar ko Roti (Buckwheat) + Mixed Veg Tarkari', 'serving', 400, 10, 50, 13),
('Thukpa with mixed vegetables and egg', 'serving', 450, 15, 56, 15),
('Gundruk ko Jhol + Roti or Rice', 'serving', 350, 6, 44, 12),
('Litti Chokha', 'serving', 500, 14, 63, 17),
('Soft Dal Soup with Light Vegetable Tarkari', 'serving', 300, 10, 38, 10),
('Extra Boiled Eggs (2 pcs)', 'serving', 150, 12, 19, 5),
('Extra Roasted Soybeans (Bhatmas)', 'serving', 200, 15, 25, 7),
('Extra Local Beans / Kwati', 'serving', 200, 14, 25, 7),
('Extra Chicken / Meat portion', 'serving', 200, 25, 25, 7)
ON CONFLICT (id) DO NOTHING;
```

### 4. Run the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` to start using DietSathi!
