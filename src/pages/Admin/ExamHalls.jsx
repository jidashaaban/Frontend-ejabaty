import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Shuffle as ShuffleIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { getExamHall, updateExamHallCapacity } from '../../services/adminService';
import Toast from '../../components/common/Toast';

function ExamHalls() {
  const [halls, setHalls] = useState([]); // القاعات من قاعدة البيانات
  const [students, setStudents] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [editingCapacity, setEditingCapacity] = useState(null); // تخزين ID القاعة التي يتم تعديل سعتها
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // جلب البيانات عند تحميل الصفحة
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب القاعات من قاعدة البيانات
      const hallsData = await getExamHall();
      
      // إضافة حقل capacity مؤقت (لأنه غير موجود في قاعدة البيانات)
      const hallsWithCapacity = hallsData.map(hall => ({
        ...hall,
        capacity: hall.capacity || 0, // إذا كان موجوداً نستخدمه، وإلا 0
        tempCapacity: hall.capacity || 0, // سعة مؤقتة للتعديل
      }));
      setHalls(hallsWithCapacity);

      // بيانات وهمية للطلاب (في الحقيقية تجلب من API)
      const mockStudents = [
        { id: 1, name: 'أحمد محمد', grade: 'الصف التاسع', subject: 'الرياضيات' },
        { id: 2, name: 'سارة خالد', grade: 'الصف التاسع', subject: 'الرياضيات' },
        { id: 3, name: 'محمد علي', grade: 'الصف التاسع', subject: 'الرياضيات' },
        { id: 4, name: 'نور حسين', grade: 'البكالوريا علمي', subject: 'الفيزياء' },
        { id: 5, name: 'عمر وائل', grade: 'البكالوريا علمي', subject: 'الفيزياء' },
        { id: 6, name: 'ليلى كريم', grade: 'البكالوريا علمي', subject: 'الفيزياء' },
        { id: 7, name: 'هدى سمير', grade: 'البكالوريا أدبي', subject: 'التاريخ' },
        { id: 8, name: 'رامي نضال', grade: 'البكالوريا أدبي', subject: 'التاريخ' },
        { id: 9, name: 'فاطمة زكي', grade: 'البكالوريا أدبي', subject: 'التاريخ' },
        { id: 10, name: 'يوسف كريم', grade: 'الصف التاسع', subject: 'الرياضيات' },
        { id: 11, name: 'زينب هاني', grade: 'البكالوريا علمي', subject: 'الفيزياء' },
        { id: 12, name: 'عبد الله سامي', grade: 'البكالوريا أدبي', subject: 'التاريخ' },
      ];
      setStudents(mockStudents);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
      setToast({ open: true, message: 'فشل في جلب البيانات', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // بدء تعديل سعة القاعة
  const handleStartEditCapacity = (hall) => {
    setEditingCapacity(hall.id);
    setHalls(halls.map(h => 
      h.id === hall.id ? { ...h, tempCapacity: h.capacity } : h
    ));
  };

  // تغيير قيمة السعة المؤقتة
  const handleCapacityChange = (hallId, value) => {
    setHalls(halls.map(h => 
      h.id === hallId ? { ...h, tempCapacity: parseInt(value) || 0 } : h
    ));
  };

  // حفظ سعة القاعة
  const handleSaveCapacity = async (hall) => {
    try {
      await updateExamHallCapacity(hall.id, hall.tempCapacity);
      setHalls(halls.map(h => 
        h.id === hall.id ? { ...h, capacity: hall.tempCapacity } : h
      ));
      setEditingCapacity(null);
      setToast({ open: true, message: `تم تحديث سعة القاعة ${hall.name} بنجاح`, severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'فشل في تحديث السعة', severity: 'error' });
    }
  };

  // توزيع الطلاب (مرتبين: تاسع ← بكالوريا علمي ← بكالوريا أدبي)
  const handleDistribute = () => {
    if (halls.length === 0) {
      setToast({ open: true, message: 'لا توجد قاعات. يرجى إضافة قاعات أولاً', severity: 'error' });
      return;
    }

    // التحقق من أن جميع القاعات لها سعة محددة
    const hallsWithoutCapacity = halls.filter(h => !h.capacity || h.capacity <= 0);
    if (hallsWithoutCapacity.length > 0) {
      setToast({ 
        open: true, 
        message: `القاعات التالية ليس لها سعة محددة: ${hallsWithoutCapacity.map(h => h.name).join(', ')}`, 
        severity: 'error' 
      });
      return;
    }

    setLoading(true);
    
    // ترتيب الطلاب حسب المرحلة (تاسع → بكالوريا علمي → بكالوريا أدبي)
    const gradeOrder = { 'الصف التاسع': 1, 'البكالوريا علمي': 2, 'البكالوريا أدبي': 3 };
    const sortedStudents = [...students].sort((a, b) => gradeOrder[a.grade] - gradeOrder[b.grade]);
    
    // نسخ القاعات مع السعة المتبقية
    let availableHalls = halls.map(hall => ({
      ...hall,
      remaining: hall.capacity,
      students: [],
    }));
    
    // توزيع الطلاب على القاعات
    for (const student of sortedStudents) {
      let assigned = false;
      
      for (const hall of availableHalls) {
        if (hall.remaining > 0) {
          hall.students.push({
            ...student,
            hallName: hall.name,
            hallId: hall.id,
          });
          hall.remaining--;
          assigned = true;
          break;
        }
      }
      
      if (!assigned) {
        setUnassignedStudents(prev => [...prev, student]);
      }
    }
    
    // تجميع النتائج النهائية
    const finalDistribution = [];
    for (const hall of availableHalls) {
      finalDistribution.push(...hall.students);
    }
    
    setDistribution(finalDistribution);
    setLoading(false);
    
    const remainingCount = students.length - finalDistribution.length;
    if (remainingCount > 0) {
      setToast({
        open: true,
        message: `⚠️ تنبيه: ${remainingCount} طالب لم يتم توزيعهم بسبب عدم وجود سعة كافية في القاعات`,
        severity: 'warning',
      });
    } else {
      setToast({ open: true, message: '✅ تم توزيع الطلاب بنجاح', severity: 'success' });
    }
  };

  // إعادة تعيين التوزيع
  const handleReset = () => {
    setDistribution([]);
    setUnassignedStudents([]);
    setToast({ open: true, message: 'تم إعادة تعيين التوزيع', severity: 'info' });
  };

  // حساب إحصائيات القاعات
  const getHallStats = () => {
    const stats = {};
    for (const hall of halls) {
      const assigned = distribution.filter(d => d.hallName === hall.name).length;
      stats[hall.name] = { capacity: hall.capacity, assigned };
    }
    return stats;
  };

  const hallStats = getHallStats();
  const remainingCount = students.length - distribution.length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        🏫 إدارة القاعات الامتحانية
      </Typography>

      {/* قائمة القاعات مع إمكانية تعديل السعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            القاعات المتاحة (يتم جلبها من قاعدة البيانات)
          </Typography>
          
          <Grid container spacing={2}>
            {halls.map((hall) => (
              <Grid item xs={12} sm={6} md={4} key={hall.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{hall.name}</Typography>
                    </Box>
                    
                    {/* حقل تعديل السعة */}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      {editingCapacity === hall.id ? (
                        <>
                          <TextField
                            type="number"
                            size="small"
                            value={hall.tempCapacity}
                            onChange={(e) => handleCapacityChange(hall.id, e.target.value)}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">طالب</InputAdornment>,
                            }}
                            sx={{ width: 120 }}
                          />
                          <IconButton 
                            onClick={() => handleSaveCapacity(hall)} 
                            color="primary" 
                            size="small"
                          >
                            <SaveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2" color="text.secondary">
                            السعة: {hall.capacity || 'غير محدد'} طالب
                          </Typography>
                          <IconButton 
                            onClick={() => handleStartEditCapacity(hall)} 
                            color="primary" 
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    {/* إحصائيات التوزيع بعد التوليد */}
                    {hallStats[hall.name] && distribution.length > 0 && (
                      <Chip
                        label={`${hallStats[hall.name].assigned} / ${hallStats[hall.name].capacity} طالب موزع`}
                        color={hallStats[hall.name].assigned <= hallStats[hall.name].capacity ? 'success' : 'error'}
                        size="small"
                        sx={{ mt: 2 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {halls.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="info">لا توجد قاعات في قاعدة البيانات.</Alert>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* أزرار التوزيع */}
      {halls.length > 0 && students.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            توزيع الطلاب على القاعات
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            سيتم ترتيب الطلاب تلقائياً حسب المرحلة (تاسع ← بكالوريا علمي ← بكالوريا أدبي) ثم توزيعهم على القاعات
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShuffleIcon />}
              onClick={handleDistribute}
              disabled={loading}
            >
              توليد توزيع عشوائي (مرتب حسب المرحلة)
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              disabled={distribution.length === 0}
            >
              إعادة تعيين
            </Button>
          </Box>
        </Paper>
      )}

      {/* تنبيه الطلاب غير الموزعين */}
      {remainingCount > 0 && distribution.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon />
            <Typography fontWeight="bold">
              ⚠️ تنبيه: {remainingCount} طالب لم يبقى لهم مكان في القاعات!
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>
            يرجى زيادة سعة القاعات الحالية أو إضافة قاعات جديدة.
          </Typography>
        </Alert>
      )}

      {/* قائمة التوزيع */}
      {distribution.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              📋 قائمة توزيع الطلاب على القاعات
            </Typography>
            <Chip
              label={`إجمالي الموزعين: ${distribution.length} طالب`}
              color="success"
            />
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell align="center">#</TableCell>
                <TableCell>اسم الطالب</TableCell>
                <TableCell>المرحلة الدراسية</TableCell>
                <TableCell>المادة</TableCell>
                <TableCell align="center">رقم القاعة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {distribution.map((student, index) => (
                <TableRow key={student.id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={student.grade}
                      size="small"
                      color={
                        student.grade === 'الصف التاسع' ? 'primary' :
                        student.grade === 'البكالوريا علمي' ? 'success' : 'warning'
                      }
                    />
                  </TableCell>
                  <TableCell>{student.subject}</TableCell>
                  <TableCell align="center">
                    <Chip label={student.hallName} variant="outlined" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </Box>
  );
}

export default ExamHalls;