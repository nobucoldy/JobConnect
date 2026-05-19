import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './JobForm.css';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    salary: '',
    salaryUnit: 'ngày',
    startDate: '',
    endDate: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchJobData();
    }
  }, [id]);

  const fetchJobData = async () => {
    setFetchLoading(true);
    try {
      const response = await jobService.getJobById(id);
      const job = response.data.data;

      setFormData({
        title: job.title,
        description: job.description,
        category: job.category,
        location: job.location,
        salary: job.salary,
        salaryUnit: job.salaryUnit || 'ngày',
        startDate: job.startDate ? job.startDate.split('T')[0] : '',
        endDate: job.endDate ? job.endDate.split('T')[0] : ''
      });
    } catch (err) {
      alert('Không thể tải thông tin công việc');
      navigate('/my-jobs');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề công việc';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Tiêu đề phải có ít nhất 10 ký tự';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả công việc';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Mô tả phải có ít nhất 20 ký tự';
    }

    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Vui lòng nhập địa điểm';
    }

    if (!formData.salary) {
      newErrors.salary = 'Vui lòng nhập mức lương';
    } else if (formData.salary < 0) {
      newErrors.salary = 'Mức lương không hợp lệ';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        salary: Number(formData.salary)
      };

      if (isEditMode) {
        await jobService.updateJob(id, jobData);
        alert('Cập nhật công việc thành công!');
        navigate(`/jobs/${id}`);
      } else {
        const response = await jobService.createJob(jobData);
        alert('Đăng công việc thành công!');
        navigate(`/jobs/${response.data.data._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="job-form-page">
        <div className="job-form-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="job-form-page">
      <div className="job-form-container">
        <div className="job-form-header">
          <h1>{isEditMode ? 'Chỉnh sửa công việc' : 'Đăng tin tuyển dụng'}</h1>
          <p>{isEditMode ? 'Cập nhật thông tin công việc của bạn' : 'Hoàn thiện các thông tin bên dưới để đăng công việc của bạn'}</p>
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          <Input
            label="Tiêu đề công việc"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="VD: Nhân viên giao hàng nội thành"
          />

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Mô tả công việc <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết công việc, yêu cầu, trách nhiệm..."
              className={`form-textarea ${errors.description ? 'error' : ''}`}
              rows="5"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Danh mục <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-select ${errors.category ? 'error' : ''}`}
              >
                <option value="">Chọn danh mục</option>
                <option value="Giao hàng">Giao hàng</option>
                <option value="Dọn dẹp">Dọn dẹp</option>
                <option value="Gia sư">Gia sư</option>
                <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                <option value="Khác">Khác</option>
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          <div className="form-row">
            <Input
              label="Mức lương (VNĐ)"
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              error={errors.salary}
              required
              placeholder="200000"
            />

            <div className="form-group">
              <label htmlFor="salaryUnit" className="form-label">
                Đơn vị tính <span className="required">*</span>
              </label>
              <select
                id="salaryUnit"
                name="salaryUnit"
                value={formData.salaryUnit}
                onChange={handleChange}
                className="form-select"
              >
                <option value="giờ">Giờ</option>
                <option value="buổi">Buổi</option>
                <option value="ngày">Ngày</option>
                <option value="tuần">Tuần</option>
                <option value="tháng">Tháng</option>
                <option value="dự án">Dự án</option>
              </select>
            </div>
          </div>

          <Input
            label="Địa điểm làm việc"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            required
            placeholder="VD: Quận 1, TP.HCM"
          />

          <div className="form-row">
            <Input
              label="Ngày bắt đầu"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={errors.startDate}
              required
            />

            <Input
              label="Ngày kết thúc"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={errors.endDate}
              required
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Quay lại
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Đăng việc')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
