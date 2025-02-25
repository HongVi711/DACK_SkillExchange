# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# Skill_Exchange
Structure
my-react-app/
├── public/
│  
│   ├── favicon.ico         # Icon trang web
│   ├── manifest.json       # Thông tin cho PWA (nếu có)
│   └── ...                  # Các asset tĩnh khác (hình ảnh, fonts,...)
├── src/
│   ├── components/       # Các component React tái sử dụng
│   │   ├── Button/         # Ví dụ về một component
│   │   │   ├── Button.jsx  # Code component
│   │   │   ├── Button.module.css # CSS modules (nếu dùng)
│   │   │   └── index.js    # Export component (tùy chọn)
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   └── Input.css
│   │   └── ...
│   ├── pages/            # Các "page" hoặc route (nếu dùng React Router)
│   │   ├── HomePage/       # Trang chủ
│   │   │   ├── HomePage.jsx
│   │   │   └── HomePage.css
│   │   ├── AboutPage/      # Trang giới thiệu
│   │   │   ├── AboutPage.jsx
│   │   │   └── AboutPage.css
│   │   └── ...
│   ├── services/         # Gọi API, xử lý dữ liệu backend
│   │   ├── api.js        # Chứa các hàm gọi API
│   │   ├── authService.js # Xử lý xác thực
│   │   └── ...
│   ├── context/          # Context API cho quản lý state toàn cục (tùy chọn)
│   │   ├── AuthContext.jsx  # Context xác thực
│   │   └── ...
│   ├── hooks/            # Custom React hooks (tái sử dụng logic)
│   │   ├── useFetch.js     # Hook gọi API và xử lý loading/error
│   │   └── ...
│   ├── utils/            # Các hàm tiện ích (format date, validate data,...)
│   │   ├── dateUtils.js
│   │   ├── validation.js
│   │   └── ...
│   ├── App.jsx             # Component root của ứng dụng
│   ├── index.jsx           # Điểm vào của ứng dụng (render App vào DOM)
│   ├── index.css           # CSS toàn cục (nếu cần)
│   ├── reportWebVitals.js # Đo lường hiệu năng (nếu dùng Create React App)
│   └── setupTests.js      # Cấu hình testing (nếu dùng Create React App)
├── index.html          # Trang HTML chính
├── .gitignore
├── package.json
├── README.md
├──  vite.config.js   
└── ...
