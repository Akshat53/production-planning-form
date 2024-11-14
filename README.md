# Production Planning Form

A web application for managing production plans and fabric requirements. This application allows users to create detailed production plans, manage fabric selections, and handle international fabric requirements.

## 🚀 Live Demo

- [Live Demo](https://production-planning-form.vercel.app/)
- [GitHub Repository](https://github.com/Akshat53/production-planning-form.git)

## 📁 Project Structure

```
PRODUCTION-PLANNING-FORM/
├── src/
│   ├── app/
│   │   ├── fonts/
│   │   ├── submissions/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── form/
│   │   │   ├── BasicInfoStep.tsx
│   │   │   ├── FabricDetailsStep.tsx
│   │   │   ├── InternationalFabricsStep.tsx
│   │   │   └── ProductionPlanningForm.tsx
│   │   └── ui/
│   └── lib/
├── .eslintrc.json
├── .gitignore
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.ts
```

## ✨ Features

- **Multi-Step Form Implementation**
  - Basic Information Step (`BasicInfoStep.tsx`)
  - Fabric Details Step (`FabricDetailsStep.tsx`)
  - International Fabrics Step (`InternationalFabricsStep.tsx`)
  - Main Form Controller (`ProductionPlanningForm.tsx`)

- **Submissions Page**
  - View all submitted production plans
  - Detailed view of each submission
  - Historical data tracking

- **Form Management**
  - Type-safe form handling with TypeScript
  - Form state persistence
  - Data validation

- **Styling & UI**
  - Custom font implementation
  - Tailwind CSS configuration
  - Shadcn UI components
  - Global styles
  - Custom favicon

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: 
  - Tailwind CSS
  - Shadcn UI components
  - Custom fonts
- **Language**: TypeScript
- **Form Handling**: React Hook Form
- **State Management**: Local Storage
- **UI Components**: Custom components in `components/ui`

## 📋 Application Pages

1. **Main Form** (`app/page.tsx`)
   - Multi-step production planning form
   - Real-time validation
   - Dynamic fabric selection

2. **Submissions** (`app/submissions/page.tsx`)
   - View all submitted forms
   - Detailed submission information
   - Submission history tracking

## 🔄 Data Flow

1. User fills out the multi-step form
2. Data is validated and processed
3. Submission is stored in local storage
4. Submissions can be viewed on the submissions page
5. Data persists across browser sessions

## 📥 Installation

1. Clone the repository:
```bash
git clone your-repository-url
```

2. Navigate to the project directory:
```bash
cd production-planning-form
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Form Steps

1. **Basic Information** (`BasicInfoStep.tsx`)
   - Start Date
   - End Date
   - Production Per Day
   - Total Order Quantity

2. **Fabric Details** (`FabricDetailsStep.tsx`)
   - Fabric Name
   - Per Piece Requirement
   - Unit Selection
   - Processes
   - Color
   - Quantity
   - Stages to Skip

3. **International Fabrics** (`InternationalFabricsStep.tsx`)
   - China Fabric Selection
   - Major Fabric Designation

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop devices (1024px and above)
- Tablet devices (768px to 1023px)
- Mobile devices (below 768px)

## 🔄 State Management

- Form state is managed using React Hook Form
- Submissions are stored in local storage
- Selected fabrics are tracked to prevent duplicate selection

## 🚨 Error Handling

- Form validation errors are clearly displayed
- Type-safe error handling
- User input validation with helpful error messages

## 📈 Future Improvements

- [ ] Add API integration for data submission
- [ ] Implement user authentication
- [ ] Add data export functionality
- [ ] Include form templates
- [ ] Add batch processing capabilities
- [ ] Implement search and filter in submissions page
- [ ] Add sorting capabilities for submissions
- [ ] Implement data visualization for submissions

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 📞 Support

For support, email work.iamakshat@gmail.com or create an issue in the GitHub repository.

## 🙏 Acknowledgments

- shadcn/ui for the UI components
- Tailwind CSS for the styling system
- Next.js team for the framework