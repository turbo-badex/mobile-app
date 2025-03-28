
# NaijaRizz

## The Ultimate Nigerian Rizz Assistant

NaijaRizz is a web application designed to help Nigerians improve their dating and social messaging game with culturally relevant pickup lines, conversation starters, and chat assistance.

![NaijaRizz Logo](/public/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png)

## Features

### 💬 Screenshot Analysis
Upload screenshots of dating profiles or conversations and get AI-powered response suggestions with authentic Nigerian flavor.

### ✍️ Manual Text Entry
Type conversation details manually and receive personalized, culturally relevant response suggestions.

### 🇳🇬 Nigerian Rizz Lines
Access a curated collection of Nigerian-style pickup lines categorized by style.

### 🔄 Language Toggle
Switch between Standard English and Nigerian Pidgin for all responses.

### 💯 Multiple Response Styles
Choose between Genuine, NSFW, and Classic response styles to match your conversation needs.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- Supabase
- Tesseract.js (OCR)
- DeepSeek AI

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/naijarizz.git
   cd naijarizz
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key (optional)
   VITE_OPENAI_API_KEY=your_openai_api_key (optional)
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Visit `http://localhost:5173` in your browser.

## Project Structure

- `src/components` - UI components
- `src/pages` - Main application pages
- `src/services` - API and service integrations
- `src/utils` - Utility functions
- `src/hooks` - Custom React hooks
- `supabase/functions` - Supabase Edge Functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Nigerian slang and cultural references curated by native speakers

## Contact

- Project Link: [https://github.com/yourusername/naijarizz](https://github.com/yourusername/naijarizz)
