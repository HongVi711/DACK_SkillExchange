import Card from "../../components/Card";

function Home() {
  const features1 = [
    { heading: "Kết nối", description: "Gặp gỡ những người có cùng đam mê." },
    {
      heading: "Lịch học linh hoạt",
      description: "Tự do sắp xếp thời gian học phù hợp.",
    },
    {
      heading: "Đánh giá chất lượng",
      description: "Hệ thống nhận xét giúp cải thiện trải nghiệm.",
    },
    {
      heading: "Gợi ý thông minh",
      description: "Tìm người phù hợp nhanh chóng.",
    },
  ];
  const features2 = [
    {
      step: "1",
      heading: "Đăng ký tài khoản",
      description: "Tạo hồ sơ cá nhân miễn phí.",
    },
    {
      step: "2",
      heading: "Cập nhật kỹ năng",
      description: "Chọn kỹ năng bạn có và muốn học.",
    },
    {
      step: "3",
      heading: "Kết nối",
      description: "Tìm và kết nối với người phù hợp.",
    },
    {
      step: "4",
      heading: "Học hỏi & Đánh giá",
      description: "Học tập và nhận xét để phát triển.",
    },
  ];

  return (
    <>
      <Card title="Tại sao chọn Skill Exchange?" features={features1} />
      <Card title="Các tính năng nổi bật" features={features2} />
    </>
  );
}

export default Home;
