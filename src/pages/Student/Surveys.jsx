import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
} from '@mui/material';
import { getSurveys, submitSurveyResponse } from '../../services/studentService';
import Toast from '../../components/common/Toast';

const Surveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const fetchData = async () => {
    const data = await getSurveys();
    setSurveys(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStart = (survey) => {
    setSelectedSurvey(survey);
    setResponses({});
  };

  const handleChange = (qId, value) => {
    setResponses({ ...responses, [qId]: value });
  };

  const handleSubmit = async () => {
    await submitSurveyResponse(selectedSurvey.id, responses);
    setToast({ open: true, message: 'تم إرسال الاستبيان', severity: 'success' });
    setSelectedSurvey(null);
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        الاستبيانات
      </Typography>
      {!selectedSurvey ? (
        <div>
          {surveys.map((survey) => (
            <Paper key={survey.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1">{survey.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {survey.description}
              </Typography>
              <Button variant="outlined" onClick={() => handleStart(survey)}>
                ابدأ
              </Button>
            </Paper>
          ))}
        </div>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {selectedSurvey.title}
          </Typography>
          {selectedSurvey.questions.map((q) => (
            <div key={q.id} style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle1">{q.question}</Typography>
              {q.type === 'text' && (
                <TextField
                  fullWidth
                  margin="normal"
                  value={responses[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
              {q.type === 'choice' && (
                <RadioGroup
                  value={responses[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                >
                  {q.choices.map((choice, index) => (
                    <FormControlLabel key={index} value={choice} control={<Radio />} label={choice} />
                  ))}
                </RadioGroup>
              )}
              {q.type === 'rating' && (
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={responses[q.id] || 3}
                  onChange={(e, value) => handleChange(q.id, value)}
                  valueLabelDisplay="auto"
                />
              )}
            </div>
          ))}
          <Button variant="contained" onClick={handleSubmit}>
            إرسال
          </Button>
        </Paper>
      )}
      <Toast
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.message}
        severity={toast.severity}
      />
    </div>
  );
};

export default Surveys;