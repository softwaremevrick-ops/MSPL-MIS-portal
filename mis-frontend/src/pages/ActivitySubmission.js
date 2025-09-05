import { useState } from "react";
import ProjectActivity from "../components/entities/ProjectActivity";
import User from "../components/entities/User";
import Card from "../components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Label from "../components/ui/Label";
import Select from "../components/ui/Select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import Calendar from "../components/ui/Calendar";
import Popover from "../components/ui/Popover";
import { PopoverContent, PopoverTrigger } from "../components/ui/Popover";
import { CalendarIcon, Save, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "../components/utils/index";
import Alert from "../components/ui/Alert";
import { AlertDescription } from "../components/ui/Alert";

const ACTIVITY_TYPES = [
  "Scanned Documents",
  "Manpower Data", 
  "Documents Dispatched",
  "Image QC",
  "DMS",
  "Returns"
];

const STATUSES = [
  "Completed",
  "Pending",
  "Pending Review",
  "On Hold"
];

const LOCATIONS = [
  "Mumbai",
  "New Delhi",
  "Chennai", 
  "Kolkata",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Ahmedabad"
];

export default function ActivitySubmission() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    activity_date: new Date(),
    location: "",
    project_id: "",
    activity_type: "",
    quantity_count: "",
    status: "Completed",
    remarks: ""
  });

  const generateSubmissionId = () => {
    const date = format(new Date(), "yyyyMMdd");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SBI/DEL/${date}/${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const user = await User.me();
      await ProjectActivity.create({
        ...formData,
        submission_id: generateSubmissionId(),
        activity_date: format(formData.activity_date, "yyyy-MM-dd"),
        quantity_count: parseFloat(formData.quantity_count),
        submitted_by: user.email
      });
      
      setMessage({ type: 'success', text: 'Activity submitted successfully!' });
      setTimeout(() => {
        navigate(createPageUrl("ManpowerDashboard"));
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error submitting activity. Please try again.' });
      console.error('Error submitting activity:', error);
    }
    setIsLoading(false);
  };

  const handleClearForm = () => {
    setFormData({
      activity_date: new Date(),
      location: "",
      project_id: "",
      activity_type: "",
      quantity_count: "",
      status: "Completed",
      remarks: ""
    });
    setMessage(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">DAILY ACTIVITY SUBMISSION</h1>
          <p className="text-blue-500 mt-1">Submit your daily project activities</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-slate-800 text-white">
            <CardTitle>SUBMISSION FORM</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {message && (
              <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Submission ID Display */}
                <div className="space-y-2">
                  <Label>SUBMISSION ID:</Label>
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-gray-700">
                    {generateSubmissionId()}
                  </div>
                </div>

                {/* Activity Date */}
                <div className="space-y-2">
                  <Label>ACTIVITY DATE: *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.activity_date, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.activity_date}
                        onSelect={(date) => setFormData({...formData, activity_date: date})}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>LOCATION: *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({...formData, location: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Project ID */}
                <div className="space-y-2">
                  <Label>PROJECT ID: *</Label>
                  <Input
                    value={formData.project_id}
                    onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                    placeholder="Enter project ID"
                  />
                </div>

                {/* Activity Type */}
                <div className="space-y-2">
                  <Label>ACTIVITY TYPE: *</Label>
                  <Select
                    value={formData.activity_type}
                    onValueChange={(value) => setFormData({...formData, activity_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity/Count */}
                <div className="space-y-2">
                  <Label>QUANTITY/COUNT: *</Label>
                  <Input
                    type="number"
                    value={formData.quantity_count}
                    onChange={(e) => setFormData({...formData, quantity_count: e.target.value})}
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label>STATUS: *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <Label>REMARKS:</Label>
                <Textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  placeholder="Enter any additional remarks..."
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearForm}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  CLEAR FORM
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 min-w-[120px]"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}