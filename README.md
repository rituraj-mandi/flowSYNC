# flowSYNC

A modern web application that combines productivity tools with note-taking capabilities. flowSYNC integrates a customizable Pomodoro timer with a comprehensive note management system, allowing you to stay focused and organized from any device with an internet connection.

## 🚀 Features

### ⏰ Pomodoro Timer
- **Customizable intervals**: Choose between Pomodoro (25 min), Short Break (5 min), or Long Break (10 min)
- **Full timer controls**: Start, pause, and reset functionality
- **Visual display**: Large, easy-to-read timer with responsive design
- **Mobile optimized**: Works seamlessly across all devices

### 📝 Note Management
- **Cloud synchronization**: Access your notes from any device
- **Organized categories**: Sort notes into Work, Project, and Personal categories
- **Important notes**: Mark critical notes for quick identification
- **Real-time editing**: Edit notes with instant save functionality
- **Responsive grid layout**: Notes display beautifully on all screen sizes

### 🔐 User Authentication
- **Secure login/signup**: Email and password authentication
- **User sessions**: Persistent login across browser sessions
- **Data privacy**: Notes are tied to individual user accounts

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (Database & Authentication)
- **Styling**: Custom CSS with responsive design
- **Fonts**: Gidugu and Steamflix Sans from CDN Fonts

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for cloud sync
- Supabase account (for backend services)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/flowSYNC.git
cd flowSYNC
```

### 2. Set Up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Create a table named `notes` with the following structure:
   ```sql
   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     title TEXT NOT NULL,
     content TEXT,
     category TEXT NOT NULL,
     important BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
3. Update the Supabase credentials in `script.js`:
   ```javascript
   const SUPABASE_URL = 'your-supabase-url';
   const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
   ```

### 3. Set Up Row Level Security (RLS)
Enable RLS on the notes table and create policies:
```sql
-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own notes
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own notes
CREATE POLICY "Users can insert own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own notes
CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own notes
CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Deploy
Deploy the files to your preferred hosting service:
- **Netlify**: Drag and drop the project folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable Pages in repository settings
- **Local**: Use a local server like Live Server extension in VS Code

## 📱 Usage

### Getting Started
1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Set Timer**: Choose your preferred work interval (Pomodoro, Short Break, or Long Break)
3. **Start Working**: Click START to begin your focused work session
4. **Take Notes**: Click the "Add" button to create notes during or after your work sessions

### Timer Functions
- **Pomodoro (25 min)**: Standard focused work session
- **Short Break (5 min)**: Quick break between work sessions
- **Long Break (10 min)**: Extended break after multiple work sessions
- **Controls**: START/PAUSE to control timer, RESET to restart current interval

### Note Management
- **Create Notes**: Click "✎Add" button to open the note creation modal
- **Categorize**: Organize notes into Work, Project, or Personal categories
- **Mark Important**: Toggle the IMPORTANT flag for critical notes
- **Edit Notes**: Click any note to view and edit its content
- **Delete Notes**: Remove notes you no longer need

## 🎨 Customization

### Styling
- Modify `style.css` to change colors, fonts, or layout
- Background image can be replaced in the `images/` directory
- Timer font sizes are responsive and can be adjusted in CSS

### Timer Intervals
Update timer durations in `script.js`:
```javascript
document.getElementById('time1').addEventListener('click', () => setTimer(10)); // Long Break
document.getElementById('time2').addEventListener('click', () => setTimer(5));  // Short Break
document.getElementById('time3').addEventListener('click', () => setTimer(25)); // Pomodoro
```

## 📂 Project Structure
```
flowSYNC/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript functionality
├── images/             # Images and icons
│   ├── logo.png        # App logo
│   ├── backg.webp      # Background image
│   └── icons/          # Favicon and app icons
└── README.md           # Project documentation
```

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

**Notes not saving**
- Ensure you're logged in
- Check internet connection
- Verify Supabase configuration

**Timer not working**
- Check browser console for JavaScript errors
- Ensure JavaScript is enabled in browser

**Responsive issues**
- Clear browser cache
- Check viewport meta tag in HTML

### Support
- Create an issue on GitHub
- Check existing issues for solutions
- Contribute to the project documentation

## 🔄 Updates & Roadmap

### Current Version: 1.0.0
- Basic Pomodoro timer functionality
- Note creation and management
- User authentication
- Responsive design

### Planned Features
- Timer sound notifications
- Note search functionality
- Export notes feature
- Dark mode toggle
- Statistics and productivity tracking

---

**flowSYNC** - Flow into productivity, sync across devices. ⏰📝.
