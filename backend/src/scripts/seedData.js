const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');

// Kết nối database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobco')
  .then(() => console.log('✅ Kết nối database thành công'))
  .catch(err => {
    console.error('❌ Lỗi kết nối database:', err);
    process.exit(1);
  });

// Dữ liệu người dùng mẫu
const users = [
  {
    name: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    password: 'password123',
    phone: '0901234567',
    role: 'user'
  },
  {
    name: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    password: 'password123',
    phone: '0902345678',
    role: 'user'
  },
  {
    name: 'Lê Minh Châu',
    email: 'leminhchau@gmail.com',
    password: 'password123',
    phone: '0903456789',
    role: 'user'
  },
  {
    name: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    password: 'password123',
    phone: '0904567890',
    role: 'user'
  },
  {
    name: 'Hoàng Văn Em',
    email: 'hoangvanem@gmail.com',
    password: 'password123',
    phone: '0905678901',
    role: 'user'
  },
  {
    name: 'Admin User',
    email: 'admin@jobco.com',
    password: 'admin123',
    phone: '0900000000',
    role: 'admin'
  }
];

// Dữ liệu công việc mẫu thực tế
const jobsData = [
  {
    title: 'Giao hàng nhanh khu vực Quận 1',
    description: 'Cần người giao hàng nhanh cho các đơn hàng trong khu vực Quận 1. Yêu cầu có xe máy và biết đường. Làm việc linh hoạt theo ca.',
    category: 'Giao hàng',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: 150000,
    salaryUnit: 'ngày',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-25'),
    status: 'OPEN'
  },
  {
    title: 'Dọn dẹp nhà cửa cuối tuần',
    description: 'Cần người giúp việc dọn dẹp nhà cửa vào cuối tuần. Công việc bao gồm lau nhà, quét dọn, sắp xếp đồ đạc. Nhà rộng 80m2.',
    category: 'Dọn dẹp',
    location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    salary: 200000,
    salaryUnit: 'buổi',
    startDate: new Date('2026-05-24'),
    endDate: new Date('2026-05-25'),
    status: 'OPEN'
  },
  {
    title: 'Gia sư Toán lớp 9',
    description: 'Tìm gia sư dạy Toán cho học sinh lớp 9, chuẩn bị thi vào lớp 10. Yêu cầu có kinh nghiệm và kiến thức vững. Dạy 3 buổi/tuần.',
    category: 'Gia sư',
    location: 'Quận 3, TP. Hồ Chí Minh',
    salary: 300000,
    salaryUnit: 'buổi',
    startDate: new Date('2026-05-22'),
    endDate: new Date('2026-06-22'),
    status: 'OPEN'
  },
  {
    title: 'Hỗ trợ cài đặt máy tính và phần mềm',
    description: 'Cần người có kiến thức về máy tính để hỗ trợ cài đặt Windows, Office, và các phần mềm cơ bản. Làm tại văn phòng công ty.',
    category: 'Hỗ trợ kỹ thuật',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salary: 250000,
    salaryUnit: 'ngày',
    startDate: new Date('2026-05-21'),
    endDate: new Date('2026-05-22'),
    status: 'OPEN'
  },
  {
    title: 'Giao đồ ăn khu vực Phú Nhuận',
    description: 'Tuyển shipper giao đồ ăn cho nhà hàng. Ca tối từ 17h-21h. Có tip thêm từ khách hàng. Yêu cầu nhiệt tình, giao hàng nhanh.',
    category: 'Giao hàng',
    location: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
    salary: 180000,
    salaryUnit: 'ngày',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-27'),
    status: 'OPEN'
  },
  {
    title: 'Dọn dẹp văn phòng công ty',
    description: 'Cần người dọn dẹp văn phòng sau giờ làm việc. Công việc gồm hút bụi, lau bàn ghế, dọn vệ sinh toilet. Văn phòng 100m2.',
    category: 'Dọn dẹp',
    location: 'Quận Tân Bình, TP. Hồ Chí Minh',
    salary: 220000,
    salaryUnit: 'buổi',
    startDate: new Date('2026-05-23'),
    endDate: new Date('2026-05-24'),
    status: 'OPEN'
  },
  {
    title: 'Gia sư Tiếng Anh giao tiếp',
    description: 'Tìm gia sư dạy Tiếng Anh giao tiếp cho người đi làm. Trình độ hiện tại: sơ cấp. Lịch học linh hoạt buổi tối.',
    category: 'Gia sư',
    location: 'Quận 2, TP. Hồ Chí Minh',
    salary: 350000,
    salaryUnit: 'buổi',
    startDate: new Date('2026-05-25'),
    endDate: new Date('2026-06-25'),
    status: 'OPEN'
  },
  {
    title: 'Sửa chữa máy tính tại nhà',
    description: 'Máy tính bị chậm, cần người kiểm tra và sửa chữa. Có thể cần nâng cấp RAM hoặc ổ cứng. Làm tại nhà khách.',
    category: 'Hỗ trợ kỹ thuật',
    location: 'Quận 10, TP. Hồ Chí Minh',
    salary: 200000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-22'),
    endDate: new Date('2026-05-23'),
    status: 'OPEN'
  },
  {
    title: 'Chuyển nhà trọ đồ đạc',
    description: 'Cần 2 người giúp chuyển đồ đạc từ nhà trọ cũ sang nhà mới. Khoảng cách 5km. Có nhiều đồ nặng cần vận chuyển cẩn thận.',
    category: 'Khác',
    location: 'Quận Gò Vấp, TP. Hồ Chí Minh',
    salary: 300000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-26'),
    endDate: new Date('2026-05-27'),
    status: 'OPEN'
  },
  {
    title: 'Giao hàng đường dài đi Biên Hòa',
    description: 'Cần shipper đi giao hàng từ TP.HCM đến Biên Hòa, Đồng Nai. Có hỗ trợ xăng xe. Hàng hóa nhẹ, dễ vận chuyển.',
    category: 'Giao hàng',
    location: 'Quận 12, TP. Hồ Chí Minh',
    salary: 250000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-21'),
    endDate: new Date('2026-05-22'),
    status: 'OPEN'
  },
  {
    title: 'Dọn dẹp nhà sau sửa chữa',
    description: 'Nhà vừa sửa chữa xong, cần dọn dẹp bụi bặm, vết sơn, xi măng. Diện tích 120m2. Có thể cần dụng cụ chuyên dụng.',
    category: 'Dọn dẹp',
    location: 'Quận 4, TP. Hồ Chí Minh',
    salary: 350000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-24'),
    endDate: new Date('2026-05-25'),
    status: 'OPEN'
  },
  {
    title: 'Gia sư Vật Lý lớp 10',
    description: 'Cần gia sư dạy Vật Lý lớp 10, giúp con nâng cao kiến thức và làm bài tập. Dạy 2 buổi/tuần, mỗi buổi 2 tiếng.',
    category: 'Gia sư',
    location: 'Quận 5, TP. Hồ Chí Minh',
    salary: 280000,
    salaryUnit: 'buổi',
    startDate: new Date('2026-05-23'),
    endDate: new Date('2026-06-23'),
    status: 'OPEN'
  },
  {
    title: 'Cài đặt mạng WiFi cho công ty',
    description: 'Cần kỹ thuật viên cài đặt và cấu hình hệ thống mạng WiFi cho văn phòng công ty. Khoảng 20 thiết bị kết nối.',
    category: 'Hỗ trợ kỹ thuật',
    location: 'Quận 11, TP. Hồ Chí Minh',
    salary: 400000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-21'),
    status: 'OPEN'
  },
  {
    title: 'Trông trẻ buổi tối',
    description: 'Cần người trông trẻ 2 tuổi từ 18h-22h các ngày trong tuần. Bé ngoan, dễ chăm. Yêu cầu có kinh nghiệm, yêu trẻ.',
    category: 'Khác',
    location: 'Quận 8, TP. Hồ Chí Minh',
    salary: 200000,
    salaryUnit: 'ngày',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-31'),
    status: 'OPEN'
  },
  {
    title: 'Giao tài liệu khẩn cấp',
    description: 'Cần giao tài liệu quan trọng ngay trong ngày. Từ Quận 1 đến Thủ Đức. Yêu cầu đúng giờ và cẩn thận.',
    category: 'Giao hàng',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: 120000,
    salaryUnit: 'dự án',
    startDate: new Date('2026-05-20'),
    endDate: new Date('2026-05-21'),
    status: 'OPEN'
  }
];

async function seedDatabase() {
  try {
    // Xóa dữ liệu cũ
    console.log('🗑️  Đang xóa dữ liệu cũ...');
    await Review.deleteMany({});
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});

    // Tạo users
    console.log('👥 Đang tạo users...');
    const createdUsers = [];
    for (const userData of users) {
      // Không cần hash ở đây vì User model đã có pre-save hook
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`   ✓ Tạo user: ${user.name}`);
    }

    // Tạo jobs (phân phối random cho các user, trừ admin)
    console.log('💼 Đang tạo jobs...');
    const regularUsers = createdUsers.filter(u => u.role !== 'admin');
    for (const jobData of jobsData) {
      const randomPoster = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      const job = await Job.create({
        ...jobData,
        poster: randomPoster._id
      });
      console.log(`   ✓ Tạo job: ${job.title}`);
    }

    console.log('\n✅ Seed data thành công!');
    console.log(`📊 Đã tạo:`);
    console.log(`   - ${createdUsers.length} users`);
    console.log(`   - ${jobsData.length} jobs`);
    console.log('\n📝 Thông tin đăng nhập mẫu:');
    console.log('   Email: nguyenvanan@gmail.com');
    console.log('   Password: password123');
    console.log('\n   Admin:');
    console.log('   Email: admin@jobco.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed data:', error);
    process.exit(1);
  }
}

seedDatabase();
