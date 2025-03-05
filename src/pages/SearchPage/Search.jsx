/* eslint-disable no-unused-vars */
// src/pages/SearchPage/SearchPage.tsx
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import UserCard from '../../components/UserCard/UserCard';
import './Search.css';

function SearchPage() {
  // Dữ liệu mẫu
  const sampleData = [
    { id: 1, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/03/eb/d6/03ebd625cc0b9d636256ecc44c0ea324.jpg" },
    { id: 2, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/70/a2/36/70a236f90d2803f9da32d0558be75ba1.jpg" },
    { id: 3, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/01/6e/3c/016e3c8be63c9f4d964fe2175e977fdb.jpg" },
    { id: 4, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/df/b4/a8/dfb4a8ea2fda672d750db20b38960e63.jpg" },
    { id: 5, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/69/78/19/69781905dd57ba144ab71ca4271ab294.jpg" },
    { id: 6, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/ec/f2/fe/ecf2feb9bbd41ff1875da5a05e5d17ec.jpg" },
    { id: 7, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/9d/3f/c8/9d3fc866c3ffb8177aba358460b29cc1.jpg" },
    { id: 8, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/3b/ac/ee/3baceedc0633c8cc703cad96f79816de.jpg" },
    { id: 9, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/06/63/f5/0663f52b4e6775adcd134a27853004b3.jpg" },
    { id: 10, name: 'Nguyễn Xuân Huy', job: 'Lập trình viên - Bình Dương', learn: 'Thiết kế đồ họa', day: 'Python', major: 'Python', avatar: "https://i.pinimg.com/474x/dc/f6/b3/dcf6b3dde40619bf4c0b6dfbf2b9960a.jpg" },

  ];

    const [searchTerm, setSearchTerm] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [level, setLevel] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState(''); // Thêm state cho "Theo xếp hạng"
    const [selectedOptions, setSelectedOptions] = React.useState([]);

    const handleOptionChange = (event) => {
        const value = event.target.value;
        if (selectedOptions.includes(value)) {
            setSelectedOptions(selectedOptions.filter((option) => option !== value));
        } else {
            setSelectedOptions([...selectedOptions, value]);
        }
    };

    const handleSearch = () => {
        console.log('Tìm kiếm với:', searchTerm, 'tại', location, 'trình độ', level, 'sắp xếp', sortOrder,  'và các options', selectedOptions);
        // TODO: Gọi API
    };

    return (
        <div className="search-page">
            <Header />
            <main className="search-content">
                {/* Bọc tất cả trong một div với class search-container */}
                <div className="search-container">
                    <h1 className="title">Tìm kiếm người trao đổi kỹ năng</h1>

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Nhập kỹ năng bạn muốn học"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <button onClick={handleSearch} className="search-button">
                            Tìm kiếm
                        </button>
                    </div>

                    <div className="search-filter">
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="location-select"
                        >
                            <option value="">Tất cả địa điểm</option>
                            <option value="hanoi">Hà Nội</option>
                            <option value="hcm">TP. Hồ Chí Minh</option>
                            {/* Thêm các option khác */}
                        </select>

                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="location-select"
                        >
                            <option value="">Tất cả trình độ</option>
                            <option value="beginner">Sơ cấp</option>
                            <option value="intermediate">Trung cấp</option>
                            <option value="advanced">Cao cấp</option>
                            {/* Thêm các option khác */}
                        </select>

                        {/* Thêm select cho "Theo xếp hạng" */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="location-select"
                        >
                            <option value="">Theo xếp hạng</option>
                            <option value="ascending">Tăng dần</option>
                            <option value="descending">Giảm dần</option>
                            
                        </select>
                    </div>
                </div> {/* Đóng div search-container */}

                <h2 className="result-title">Kết quả tìm kiếm</h2>
                <div className="card-container">
                    {sampleData.map((item) => (
                        <UserCard
                            key={item.id}
                            avatar={item.avatar}
                            name={item.name}
                            job={item.job}
                            learn={item.learn}
                            day={item.day}
                            major={item.major}
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default SearchPage;