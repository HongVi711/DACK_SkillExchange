function RegisterForm() {
  return (
    <div className="well no-padding">
      <form className="smart-form client-form" noValidate>
        <header>Đăng nhập</header>

        <fieldset>
          <section>
            <label className="label">Tài khoản</label>
            <label className="input">
              <i className="icon-append fa fa-user"></i>
              <input
                className="form-control login-form"
                name="username"
                required
                type="text"
              />
              <b className="tooltip tooltip-top-right">
                <i className="fa fa-user txt-color-teal"></i>
                Vui lòng điền tài khoản đăng nhập
              </b>
            </label>
          </section>
          <section>
            <label className="label">Mật mã</label>
            <label className="input">
              <i className="icon-append fa fa-lock"></i>
              <input
                className="form-control login-form"
                name="password"
                required
                type="password"
              />
              <b className="tooltip tooltip-top-right">
                <i className="fa fa-lock txt-color-teal"></i>
                Nhập mật mã của bạn
              </b>
            </label>
          </section>

          <section>
            <label className="label">Loại tài khoản</label>
            <select className="form-control" name="app_key">
              <option value="0:null">-- Chọn phân hệ --</option>
              <option value="1:MOBILE_HUTECH">Đại học - Cao đẳng</option>
              <option value="2:VQT-OUM">Viện quốc tế - OUM</option>
              <option value="3:VQT-LINCOLN">Viện quốc tế - LINCOLN</option>
              <option value="4:VQT-CYU">CY CERGY PARIS UNIVERSITÉ - CYU</option>
              <option value="5:VIEN_DTTX">
                Viện hợp tác và phát triển đào tạo
              </option>
            </select>
          </section>

          <section>
            <div className="note">
              Đăng nhập không được?{" "}
              <a href="http://qlcntt.hutech.edu.vn/ho-tro?tieu_de=tai%20khoan">
                Xem hướng dẫn tại đây
              </a>
            </div>
          </section>
        </fieldset>
        <footer>
          <button className="btn btn-primary" type="submit">
            Đăng nhập
          </button>
        </footer>
      </form>
    </div>
  );
}

export default RegisterForm;
