# NOSTALGIST™ Coming Soon Page

**Copyright © 2024 NOSTALGIST™**  
**All Rights Reserved. Confidential and Proprietary.**

---

## About

This is the official coming soon landing page for **NOSTALGIST™ | The Archive**, a system for preserving human innovation through attitude cultivation and skill development.

The page features a retro-futurist / cassette futurism design aesthetic with:
- Immersive void background with glowing grid
- CRT scanline effects
- Character-by-character text streaming (typewriter effect)
- Glass-morphism cards ("Prism" layer)
- Waitlist signup with S3 file storage integration

---

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Backend**: Node.js + Express + tRPC
- **Database**: PostgreSQL + Drizzle ORM
- **File Storage**: S3 (via Manus built-in storage)
- **Authentication**: JWT
- **Hosting**: Manus built-in hosting (can be deployed elsewhere)

---

## Project Structure

```
├── client/                 # Frontend React app
│   ├── public/
│   │   └── images/        # Generated retro-futurist assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── RetroCard.tsx
│   │   │   └── TypewriterText.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx   # Main coming soon page
│   │   │   └── WaitlistAdmin.tsx  # Admin view
│   │   ├── App.tsx
│   │   ├── index.css      # Global styles (retro theme)
│   │   └── main.tsx
│   └── index.html
├── server/                # Backend API
│   ├── index.ts
│   ├── routers.ts         # tRPC routes (waitlist)
│   ├── db.ts              # Database helpers
│   └── storage.ts         # S3 storage helpers
├── drizzle/               # Database schema & migrations
│   └── schema.ts
├── shared/                # Shared types
│   ├── const.ts
│   └── types.ts
├── package.json
├── vite.config.ts
└── README.md
```

---

## Getting Started

### **Prerequisites**

- Node.js 22+
- pnpm (package manager)
- PostgreSQL database (or use Manus built-in)

### **Installation**

1. Clone the repository:
```bash
git clone [your-repo-url]
cd nostalgist-coming-soon
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

Create a `.env` file (not included in repo) with:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/nostalgist

# JWT
JWT_SECRET=your-secret-key

# S3 Storage (if not using Manus)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket
```

4. Push database schema:
```bash
pnpm db:push
```

5. Start development server:
```bash
pnpm dev
```

6. Open http://localhost:3000

---

## Available Scripts

- `pnpm dev` - Start development server (frontend + backend)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run vitest tests
- `pnpm db:push` - Push database schema changes
- `pnpm format` - Format code with Prettier

---

## Features

### **Waitlist Signup**
- Email collection with validation
- Optional file attachment (up to 5MB)
- Files stored in S3
- Database records with metadata

### **Admin Dashboard**
- View all waitlist entries at `/admin/waitlist`
- Download attached files
- See signup timestamps

### **Design System**
- **Color Philosophy**: Deep void blacks, Amber (lore), Cyan (system), Neon Green (status)
- **Typography**: IBM Plex Mono / Space Mono (headers), Inter (body)
- **Effects**: CRT scanlines, typewriter text, glass cards, glowing grid

---

## Deployment

### **Option 1: Manus Hosting** (Recommended)
This project is designed to work with Manus built-in hosting:
1. Create checkpoint: `webdev_save_checkpoint`
2. Click "Publish" in Manus UI
3. Done - your site is live at `[your-project].manus.space`

### **Option 2: Custom Hosting**
1. Build the project:
```bash
pnpm build
```

2. Deploy `dist/` folder to:
   - Vercel
   - Netlify
   - Railway
   - Your own VPS

3. Set environment variables in your hosting provider

4. Ensure PostgreSQL database is accessible

---

## Database Schema

### **Waitlist Table**
```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL,
  file_key TEXT,      -- S3 key for uploaded file
  file_url TEXT,      -- Public URL for file
  file_name TEXT,     -- Original filename
  file_size INTEGER,  -- File size in bytes
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Customization

### **Change Colors**
Edit `client/src/index.css`:
```css
:root {
  --void-black: #0A0A0A;
  --amber: #FFC95E;
  --cyan: #6FE8FF;
  --neon-green: #32FF5E;
}
```

### **Change Fonts**
Edit `client/index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
```

### **Change Typewriter Text**
Edit `client/src/pages/Home.tsx`:
```tsx
<TypewriterText text="YOUR TEXT HERE" />
```

---

## Testing

Run the test suite:
```bash
pnpm test
```

Tests include:
- Waitlist signup validation
- File upload to S3
- Database operations
- Authentication flows

---

## Security Notes

⚠️ **Important**: This repo does NOT include:
- `.env` file (contains secrets)
- `node_modules/` (install with `pnpm install`)
- Database credentials
- S3 credentials

Make sure to:
- Never commit `.env` to Git
- Use environment variables for all secrets
- Enable HTTPS in production
- Validate all user inputs
- Sanitize file uploads

---

## License

**All Rights Reserved.**

This code is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

For licensing inquiries: [your-email]

---

## Contact

**NOSTALGIST™**  
[Your Email]  
[Your Website]

---

## Changelog

### v1.0.0 (Dec 2024)
- Initial release
- Retro-futurist coming soon page
- Waitlist signup with S3 file storage
- Admin dashboard
- Full-stack React + Node.js + PostgreSQL
