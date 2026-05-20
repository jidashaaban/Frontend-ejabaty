import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import Toast from '../../components/common/Toast';
import {
  getStudentSchedule,
  getUpcomingExams,
  getStudentPoints,
  getMyCourses,
} from '../../services/studentService';

const dayMapToArabic = {
  'Sunday': 'الأحد',
  'Monday': 'الإثنين',
  'Tuesday': 'الثلاثاء',
  'Wednesday': 'الأربعاء',
  'Thursday': 'الخميس',
};

const timeSlots = ['08:00:00', '09:30:00', '11:00:00', '12:30:00', '14:00:00', '15:30:00'];

const formatTime = (time) => time?.substring(0, 5) || time;

function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  
  const [schedule, setSchedule] = useState({});
  const [exams, setExams] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [scheduleData, examsData, pointsData, coursesData] = await Promise.all([
        getStudentSchedule(),
        getUpcomingExams(),
        getStudentPoints(),
        getMyCourses(),
      ]);

      console.log('📅 الجدول:', scheduleData);
      console.log('📝 الامتحانات:', examsData);
      console.log('⭐ النقاط (الخام):', pointsData);
      console.log('📚 المواد المسجلة (الخام):', coursesData);

      // معالجة الجدول (master_grid)
      let processedSchedule = {};
      if (scheduleData?.master_grid) {
        processedSchedule = scheduleData.master_grid;
      } else if (scheduleData?.data?.master_grid) {
        processedSchedule = scheduleData.data.master_grid;
      }
      setSchedule(processedSchedule);

      // معالجة الامتحانات
      let examsArray = [];
      if (Array.isArray(examsData)) {
        examsArray = examsData;
      } else if (examsData?.data && Array.isArray(examsData.data)) {
        examsArray = examsData.data;
      } else if (examsData?.sessions && Array.isArray(examsData.sessions)) {
        examsArray = examsData.sessions;
      }
      setExams(examsArray);

      // ✅ معالجة النقاط - التأكد من أنها قيمة رقمية وليس كائن
      let pointsValue = 0;
      if (typeof pointsData === 'number') {
        pointsValue = pointsData;
      } else if (pointsData?.total_points) {
        pointsValue = pointsData.total_points;
      } else if (pointsData?.points) {
        pointsValue = pointsData.points;
      } else if (typeof pointsData === 'object' && pointsData !== null) {
        pointsValue = pointsData.total_points || pointsData.points || 0;
      }
      setTotalPoints(pointsValue);
      console.log('⭐ النقاط المعالجة:', pointsValue);

      // معالجة المواد المسجلة
      let coursesArray = [];
      
      if (Array.isArray(coursesData)) {
        coursesArray = coursesData;
      } else if (coursesData?.data && Array.isArray(coursesData.data)) {
        coursesArray = coursesData.data;
      } else if (coursesData?.courses && Array.isArray(coursesData.courses)) {
        coursesArray = coursesData.courses;
      }
      
      console.log('📚 المصفوفة قبل التقسيم:', coursesArray);
      console.log('📚 عدد المواد:', coursesArray.length);
      
      // عرض كل مادة في Console للتأكد
      coursesArray.forEach((course, index) => {
        console.log(`📚 المادة ${index + 1}:`, {
          id: course.id,
          name: course.name,
          code: course.code,
          status: course.status,
          pivot_status: course.pivot?.status
        });
      });
      
      // تقسيم المواد إلى معتمدة وقيد الانتظار
      const approved = coursesArray.filter(c => 
        c.status === 'approved' || 
        c.status === 'active' || 
        c.status === 'accepted' ||
        c.pivot?.status === 'approved'
      );
      
      const pending = coursesArray.filter(c => 
        c.status === 'pending' || 
        c.status === 'waiting' ||
        c.pivot?.status === 'pending'
      );
      
      console.log('✅ المواد المعتمدة:', approved.length);
      console.log('⏳ المواد قيد الانتظار:', pending.length);
      
      setRegisteredCourses(approved);
      setPendingCourses(pending);

    } catch (error) {
      console.error('❌ خطأ في جلب البيانات:', error);
      setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // دالة لبناء جدول الدوام
  const buildScheduleTable = () => {
    const daysInArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const tableData = [];
    
    timeSlots.forEach(timeSlot => {
      const row = { time: formatTime(timeSlot) };
      daysInArabic.forEach(day => {
        const englishDay = Object.keys(dayMapToArabic).find(key => dayMapToArabic[key] === day);
        const dayData = schedule[englishDay];
        const session = dayData?.[timeSlot];
        if (session && session.status === 'Occupied') {
          row[day] = { name: session.course_name, hall: session.halls?.[0] };
        } else {
          row[day] = null;
        }
      });
      tableData.push(row);
    });
    
    return { days: daysInArabic, rows: tableData };
  };

  const scheduleTable = buildScheduleTable();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="500px">
        <CircularProgress />
        <Typography sx={{ mr: 2 }}>جاري تحميل لوحة التحكم...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader 
        title={`مرحباً، ${user?.name || 'الطالب'}`}
        subtitle="نظرة عامة على دراستك"
        icon={<SchoolIcon sx={{ fontSize: 20 }} />}
      />

      {/* بطاقات الإحصائيات */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">المواد المسجلة</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                    {registeredCourses.length + pendingCourses.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                  <SchoolIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">قيد الانتظار</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                    {pendingCourses.length}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#ed6c02' }}>
                  <PendingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="body2" color="text.secondary">مجموع النقاط</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                    {typeof totalPoints === 'number' ? totalPoints : (totalPoints?.total_points || totalPoints?.points || 0)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2e7d32' }}>
                  <StarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* جدول الدوام */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <CalendarIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                برنامج الدوام الأسبوعي
              </Typography>
            </Box>
            
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                    {scheduleTable.days.map(day => (
                      <TableCell key={day} align="center" sx={{ fontWeight: 'bold' }}>{day}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduleTable.rows.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                        {row.time}
                      </TableCell>
                      {scheduleTable.days.map(day => {
                        const session = row[day];
                        return (
                          <TableCell key={day} align="center">
                            {session ? (
                              <Box>
                                <Typography variant="body2" fontWeight="bold" color="primary">
                                  {session.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  🏫 {session.hall || 'غير محدد'}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            
            {Object.keys(schedule).length === 0 && (
              <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                📭 لا توجد جلسات في جدول دوامك. سيتم عرض الجدول بعد أن يقوم المدير بتوليد البرنامج.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* جدول الامتحانات */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <ScheduleIcon sx={{ color: '#ed6c02' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
                برنامج الامتحانات
              </Typography>
            </Box>
            
            {exams.length > 0 ? (
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#fff3e0' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>المادة</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>اليوم</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>التاريخ</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>الوقت</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>القاعة</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exams.map((exam, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{exam.course?.name || exam.course_name}</TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={dayMapToArabic[exam.day] || exam.day || 'غير محدد'} 
                            size="small" 
                            color="warning" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">{exam.date || '-'}</TableCell>
                        <TableCell align="center">
                          {exam.start_time?.substring(0, 5)} - {exam.end_time?.substring(0, 5)}
                        </TableCell>
                        <TableCell align="center">{exam.hall?.name || exam.room_name || 'غير محدد'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                📭 لا توجد امتحانات مسجلة حالياً
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* المواد الدراسية */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <SchoolIcon sx={{ color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                المواد الدراسية
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {/* المواد المعتمدة */}
              {registeredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, borderColor: '#4caf50' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Chip label="معتمدة" size="small" color="success" icon={<CheckCircleIcon />} />
                        <Typography variant="caption" color="text.secondary">{course.code}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ my: 1, fontSize: '1rem' }}>
                        {course.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}

              {/* المواد قيد الانتظار */}
              {pendingCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card variant="outlined" sx={{ borderRadius: 2, borderColor: '#ff9800', bgcolor: '#fff8e1' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Chip label="قيد الموافقة" size="small" color="warning" icon={<PendingIcon />} />
                        <Typography variant="caption" color="text.secondary">{course.code}</Typography>
                      </Box>
                      <Typography variant="h6" sx={{ my: 1, fontSize: '1rem' }}>
                        {course.name}
                      </Typography>
                      <Alert severity="info" sx={{ mt: 1, py: 0 }}>
                        <Typography variant="caption">⏳ بانتظار موافقة الإدارة</Typography>
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {registeredCourses.length === 0 && pendingCourses.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                📭 لا توجد مواد مسجلة حالياً
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
}

export default StudentDashboard;