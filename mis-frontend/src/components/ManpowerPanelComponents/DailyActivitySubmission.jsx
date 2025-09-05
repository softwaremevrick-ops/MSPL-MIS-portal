import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Label from '../ui/Label';
import Textarea from '../ui/Textarea';
import Alert from '../ui/Alert';
import { Loader2 } from 'lucide-react';

const DailyActivitySubmission = () => {
  const [formData, setFormData] = useState({
    activityName: '',
    description: '',
    project: '',
    location: '',
    status: 'pending',
    startTime: '',
    endTime: '',
    progressPercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.activityName.trim()) newErrors.activityName = 'Activity name is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }
    if (formData.progressPercentage < 0 || formData.progressPercentage > 100) {
      newErrors.progressPercentage = 'Progress must be between 0 and 100';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitMessage(null);
    setSubmitError(null);
    setErrors({}); // Clear previous validation errors

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.errors[0].msg || 'Activity submission failed');
      }

      setSubmitMessage('Activity submitted successfully!');
      setFormData({
        activityName: '',
        description: '',
        project: '',
        location: '',
        status: 'pending',
        startTime: '',
        endTime: '',
        progressPercentage: 0,
      });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-bold mb-4">Daily Activity Submission</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {submitMessage && <Alert type="success" message={submitMessage} className="mb-4" onDismiss={() => setSubmitMessage(null)} />}
        {submitError && <Alert type="error" message={submitError} className="mb-4" onDismiss={() => setSubmitError(null)} />}

        <div className="mb-4">
          <Label htmlFor="activityName">Activity Name</Label>
          <Input
            id="activityName"
            name="activityName"
            value={formData.activityName}
            onChange={handleChange}
            placeholder="Enter activity name"
            required
            className={`${errors.activityName ? 'border-red-500' : ''}`}
          />
          {errors.activityName && <p className="text-red-500 text-xs mt-1">{errors.activityName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              required
              className={`${errors.startTime ? 'border-red-500' : ''}`}
            />
            {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              required
              className={`${errors.endTime ? 'border-red-500' : ''}`}
            />
            {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="progressPercentage">Progress (%)</Label>
          <Input
            id="progressPercentage"
            name="progressPercentage"
            type="number"
            value={formData.progressPercentage}
            onChange={handleChange}
            min="0"
            max="100"
            className={`${errors.progressPercentage ? 'border-red-500' : ''}`}
          />
          {errors.progressPercentage && <p className="text-red-500 text-xs mt-1">{errors.progressPercentage}</p>}
        </div>

        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your activity"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="project">Project</Label>
          <Input
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            placeholder="Enter project name (optional)"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location (optional)"
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Activity'
          )}
        </Button>
      </form>
    </div>
  );
};

export default DailyActivitySubmission;
