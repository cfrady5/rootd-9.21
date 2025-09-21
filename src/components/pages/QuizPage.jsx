
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Select from 'react-select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'var(--secondary)',
    borderColor: 'var(--border)',
    borderRadius: '0.375rem',
    minHeight: '40px',
    color: 'var(--foreground)',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'var(--ring)',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? 'var(--forest-green)'
      : state.isFocused
        ? 'var(--accent)'
        : 'var(--card)',
    color: state.isSelected ? 'white' : 'var(--foreground)',
    ':active': {
      backgroundColor: 'var(--forest-green-light)',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card)',
    zIndex: 9999,
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid var(--border)',
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: 'var(--card)',
    padding: 0,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--foreground)',
  }),
};

const QuizLoadingScreen = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 bg-background flex flex-col items-center justify-center z-20">
    <Loader2 className="h-16 w-16 animate-spin text-forest-green mb-6" />
    <h1 className="text-3xl font-bold text-foreground">Loading Quiz</h1>
    <p className="text-lg text-muted-foreground mt-2">Let’s find you a deal!</p>
  </motion.div>
);

const QuizPage = ({ profile, setProfile }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [otherText, setOtherText] = useState({});
  const [sliderInteracted, setSliderInteracted] = useState(false);

  const totalQuestions = 30;

  const fetchQuizData = useCallback(async () => {
    const { data: questionsData, error: questionsError } = await supabase.from('quiz_questions').select('*').order('id', { ascending: true }).limit(totalQuestions);
    if (questionsError) {
      toast({ variant: 'destructive', title: 'Error fetching quiz questions.' });
      setLoading(false);
      return;
    }
    
    setQuestions(questionsData);

    if (user) {
      const { data: answersData } = await supabase.from('quiz_answers').select('question_id, answer').eq('user_id', user.id);
      if (answersData) {
        const answersMap = answersData.reduce((acc, ans) => {
          try {
            const parsedAnswer = JSON.parse(ans.answer);
            acc[ans.question_id] = parsedAnswer;
            if (Array.isArray(parsedAnswer) && parsedAnswer.some(a => a.startsWith("Other:"))) {
                const otherVal = parsedAnswer.find(a => a.startsWith("Other:")).replace("Other:", "").trim();
                setOtherText(prev => ({...prev, [ans.question_id]: otherVal}));
            } else if (typeof parsedAnswer === 'string' && parsedAnswer.startsWith("Other:")) {
                const otherVal = parsedAnswer.replace("Other:", "").trim();
                setOtherText(prev => ({...prev, [ans.question_id]: otherVal}));
            }
          } catch (e) { acc[ans.question_id] = ans.answer; }
          return acc;
        }, {});
        setAnswers(answersMap);
      }
    }
    setTimeout(() => setLoading(false), 300);
  }, [user, toast]);

  useEffect(() => { fetchQuizData(); }, [fetchQuizData]);

  const handleAnswerChange = async (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (user) {
      await supabase.from('quiz_answers').upsert({ user_id: user.id, question_id: questionId, answer: JSON.stringify(value) }, { onConflict: 'user_id, question_id' });
    }
  };

  const handleOtherTextChange = (questionId, text) => {
    setOtherText(prev => ({ ...prev, [questionId]: text }));
    const answer = answers[questionId];
    let newAnswer;
    if (Array.isArray(answer)) {
        newAnswer = answer.filter(a => a !== 'Other' && !a.startsWith("Other:"));
        newAnswer.push('Other');
        if(text.trim()) newAnswer.push(`Other: ${text.trim()}`);
    } else {
        newAnswer = 'Other';
        if(text.trim()) newAnswer = `Other: ${text.trim()}`;
    }
    handleAnswerChange(questionId, newAnswer);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSliderInteracted(false);
    }
  };
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSliderInteracted(false);
    }
  };

  const finishQuiz = async () => {
    setIsSubmitting(true);
    const { data, error } = await supabase.from('profiles').update({ onboarding_complete: true, updated_at: new Date().toISOString() }).eq('id', user.id).select().single();
    if (error) {
      toast({ variant: 'destructive', title: 'Error finishing quiz.', description: error.message });
      setIsSubmitting(false);
    } else {
      setProfile(data);
      setQuizCompleted(true);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) return null;
    const answer = answers[question.id];

    const renderOtherInput = (qId, type) => {
        const isOtherSelected = type === 'checkbox' ? Array.isArray(answer) && answer.includes('Other') : answer === 'Other';
        return isOtherSelected && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                <Input placeholder="Please specify" value={otherText[qId] || ''} onChange={(e) => handleOtherTextChange(qId, e.target.value)} />
            </motion.div>
        );
    };

    switch (question.question_type) {
      case 'likert':
        return (
          <div className="w-full space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-sm">{question.options.label_min}</span>
              <span className="text-2xl font-bold text-forest-green">{answer || 5}</span>
              <span className="text-muted-foreground text-sm">{question.options.label_max}</span>
            </div>
            <Slider
              value={[answer || 5]}
              onValueChange={(val) => {
                handleAnswerChange(question.id, val[0]);
                if (!sliderInteracted) setSliderInteracted(true);
              }}
              min={1} max={10} step={1} aria-label={question.question_text}
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <div key={num} className="w-full flex flex-col items-center">
                    <span className="h-2 border-l border-muted-foreground"></span>
                    <span className="mt-1">{num}</span>
                  </div>
                ))}
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options.options.map((option) => {
              const isChecked = answer?.includes(option) || false;
              return (
                <div key={option}>
                  <div onClick={() => {
                      const currentAns = answer || [];
                      let newAns;
                      if (isChecked) {
                        newAns = currentAns.filter((item) => item !== option);
                        if (option === 'Other') { newAns = newAns.filter(item => !item.startsWith("Other:")); setOtherText(prev => ({...prev, [question.id]: ''})); }
                      } else {
                        newAns = [...currentAns, option];
                      }
                      if (question.options.max_select && newAns.filter(a => a !== 'Other' && !a.startsWith("Other:")).length > question.options.max_select) {
                        toast({ variant: 'destructive', title: `You can only select up to ${question.options.max_select} options.` }); return;
                      }
                      handleAnswerChange(question.id, newAns);
                    }}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isChecked ? 'quiz-option-selected' : 'bg-secondary border-transparent hover:border-gray-300'}`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-white border-forest-green' : 'border-border'}`}>
                      {isChecked && <Check className="w-5 h-5 text-black" />}
                    </div>
                    <span className="flex-1 text-foreground">{option}</span>
                  </div>
                  {option === 'Other' && renderOtherInput(question.id, 'checkbox')}
                </div>
              );
            })}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-3">
            {question.options.options.map((option) => {
              const isSelected = answer === option;
              return (
                <div key={option}>
                  <div onClick={() => handleAnswerChange(question.id, option)} className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isSelected ? 'quiz-option-selected' : 'bg-secondary border-transparent hover:border-gray-300'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-forest-green' : 'border-border'}`}>
                      {isSelected && <div className="w-3 h-3 bg-forest-green rounded-full" />}
                    </div>
                    <span className="flex-1 text-foreground">{option}</span>
                  </div>
                  {option === 'Other' && renderOtherInput(question.id, 'radio')}
                </div>
              );
            })}
          </div>
        );
      default: return null;
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0);
  const isNextDisabled = currentQuestion?.question_type === 'likert' && !sliderInteracted && !answers[currentQuestion.id];

  return (
    <div className="pt-24 pb-12 min-h-screen flex flex-col items-center justify-start bg-background relative">
      <Helmet><title>Rootd - Onboarding Quiz</title></Helmet>
      <AnimatePresence>{loading && <QuizLoadingScreen />}</AnimatePresence>
      <AnimatePresence mode="wait">
        {!loading && (
          quizCompleted ? (
            <motion.div key="completion-screen" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl p-8 text-center">
              <h1 className="text-3xl font-bold text-foreground mb-4">Thank you, your results will be emailed to you shortly.</h1>
              <img src="https://horizons-cdn.hostinger.com/a5ca009c-59cb-4adf-8d96-7dc5195f95b7/20e355a5f82f9c695c1b6c7a425bf1c4.png" alt="Rootd Logo" className="h-16 w-auto mx-auto my-8" />
              <Button onClick={() => navigate('/profile')} className="forest-green text-white mt-4">Complete Your Profile</Button>
            </motion.div>
          ) : (
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="w-full max-w-2xl p-8 bg-card rounded-2xl shadow-lg border border-border">
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2"><p className="text-sm font-medium text-forest-green">{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</p></div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <motion.div className="bg-forest-green h-2.5 rounded-full" style={{ width: `${progress}%` }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
                </div>
              </div>
              <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-bold text-foreground">{currentQuestion?.question_text}</h2></div>
              <div className="space-y-6 min-h-[350px]">{renderQuestion()}</div>
              <div className="mt-10 flex justify-between items-center">
                <Button variant="ghost" onClick={prevQuestion} disabled={currentQuestionIndex === 0}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={nextQuestion} disabled={isNextDisabled} className="forest-green text-white">Next <ArrowRight className="ml-2 h-4 w-4" /></Button>
                ) : (
                  <Button onClick={finishQuiz} disabled={isSubmitting} className="forest-green text-white">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Finish Quiz</Button>
                )}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPage;
