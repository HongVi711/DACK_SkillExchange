import styles from "./Register.module.css";
import RegisterImg from "../assets/images/registerimg.jpg";

function Register() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-background">
      <div className="w-full md:w-1/2">
        <h1 className="text-4xl font-bold text-primary">Skill Exchange</h1>
        <img
          src={RegisterImg}
          alt="Skill Exchange Illustration"
          className="mt-4"
        />
      </div>
      <div className="w-full md:w-1/2 bg-card p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-primary">
          Đăng Ký tài khoản
        </h2>
        <form className="mt-4">
          <label
            className="block mb-2 text-muted-foreground"
            htmlFor="username"
          >
            Tên hiển thị
          </label>
          <input
            className="w-full p-2 border border-border rounded"
            type="text"
            id="username"
            placeholder="Nhập tên hiển thị"
            required
          />

          <label
            className="block mt-4 mb-2 text-muted-foreground"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full p-2 border border-border rounded"
            type="email"
            id="email"
            placeholder="Nhập email"
            required
          />

          <label
            className="block mt-4 mb-2 text-muted-foreground"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <input
            className="w-full p-2 border border-border rounded"
            type="password"
            id="password"
            placeholder="Nhập mật khẩu"
            required
          />

          <label
            className="block mt-4 mb-2 text-muted-foreground"
            htmlFor="confirm-password"
          >
            Xác nhận mật khẩu
          </label>
          <input
            className="w-full p-2 border border-border rounded"
            type="password"
            id="confirm-password"
            placeholder="Xác nhận mật khẩu"
            required
          />

          <button
            type="submit"
            className="mt-6 w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 p-2 rounded"
          >
            Đăng Ký
          </button>
        </form>

        <p className="mt-4 text-muted-foreground">
          Bạn đã có tài khoản?{" "}
          <a href="#" className="text-primary hover:underline">
            Đăng nhập ngay!
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
