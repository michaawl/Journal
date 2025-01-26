import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReflectionService from '../services/reflection-service';
import IReflectionQuestion from '../interfaces/IReflectionQuestion';
import { ScheduleType } from '../interfaces/ScheduleType';


// Component die erstellt wird wenn Reflektionsfragen hinzugefügt, bzw. entfernt werden.

export const Questions: React.FC = () => {

    //States und Services 
    const [questions, setQuestions] = useState<IReflectionQuestion[]>([]);
    const [questionText, setQuestionText] = useState('');
    const [scheduleType, setScheduleType] = useState<ScheduleType>(ScheduleType.Daily);
    const [scheduleValue, setScheduleValue] = useState<Date | null>(new Date());

    const reflectionService = new ReflectionService();

    /*
     useEffect wird beim laden und jedem rendern der componente geladen
     hier werden die Questions geladen und wie im Interface definiert gemapped.
     */
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await reflectionService.getReflectionQuestions(1);
                const questions = response.questionsList ?? [];
                const mappedQuestions = questions.map((q: any) => ({
                    questionId: q.questionId,
                    userId: q.userId,
                    questionText: q.questionText,
                    scheduleType: q.scheduleType as ScheduleType,
                    scheduleValue: q.scheduleValue,
                }));

                // von neu nach alt softieren
                mappedQuestions.sort(
                    (a: IReflectionQuestion, b: IReflectionQuestion) =>
                        new Date(b.scheduleValue).getTime() - new Date(a.scheduleValue).getTime()
                );

                setQuestions(mappedQuestions);
            } catch (error) {
                console.error('Failed to fetch reflection questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    // funktion die das hinzfügen einer frage bearbeitet
    const handleAddQuestion = async () => {
        if (questionText.trim() && scheduleValue) {
            try {
                await reflectionService.postReflectionQuestion(
                    1, // userId: hardcoded da nur ein user
                    questionText.trim(),
                    scheduleType,
                    scheduleValue.toLocaleDateString()
                );

                const newQuestion: IReflectionQuestion = {
                    questionId: questions.length + 1,
                    userId: 1,
                    questionText: questionText.trim(),
                    scheduleType,
                    scheduleValue: scheduleValue.toLocaleDateString(),
                };

                setQuestions((prevQuestions) => [...prevQuestions, newQuestion]); //aktualisiert den state von question indem die new Question hinzugefügt wird
                setQuestionText('');
                setScheduleType(ScheduleType.Daily);
                setScheduleValue(new Date());
            } catch (error) {
                console.error('Failed to add reflection question:', error);
            }
        }
    };

    // funktion die das entfernen von Fragen bearbeitet
    const handleRemoveQuestion = async (questionId: number) => {
        try {
            await reflectionService.updateReflectionQuestionActiveStatus(questionId, false);
            setQuestions((prevQuestions) => prevQuestions.filter((q) => q.questionId !== questionId));
        } catch (error) {
            console.error(`Failed to remove reflection question with ID ${questionId}:`, error);
        }
    };

    return (
        <div className="container py-4 bg-dark">
            <h2 className="mb-4 text-center fw-bold fs-5">Reflection Manager</h2>

            {/* SECTION: Hinzufügen neuer Fragen */}
            <section className="mb-5 p-4 bg-secondary rounded border border-secondary">
                <form>
                    <div className="mb-3">
                        <label htmlFor="reflectionQuestion" className="form-label fw-bold fs-7">
                            Reflection Question
                        </label>
                        <input
                            type="text"
                            id="reflectionQuestion"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="form-control bg-secondary-subtle text-light border-secondary"
                            placeholder="Enter your question"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="scheduleType" className="form-label fw-bold fs-7">
                            Schedule Type
                        </label>
                        <select
                            id="scheduleType"
                            value={scheduleType}
                            onChange={(e) => setScheduleType(e.target.value as ScheduleType)}
                            className="form-select bg-secondary-subtle text-light border-secondary"
                        >
                            {Object.values(ScheduleType).map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="scheduleDate" className="form-label fw-bold fs-7">
                            Schedule Date
                        </label>
                        <div className="mt-2">
                            <DatePicker
                                id="scheduleDate"
                                selected={scheduleValue}
                                onChange={(date) => setScheduleValue(date)}
                                className="form-control bg-secondary-subtle text-light border-secondary"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>
                    </div>

                    <button type="button" onClick={handleAddQuestion} className="btn btn-primary">
                        Add Reflection Question
                    </button>
                </form>
            </section>

            {/* SECTION: Existierende Fragen */}
            <section className="p-4 bg-secondary rounded shadow-sm border-secondary mt-5">
                <h3 className="mb-4 fw-bold fs-7">Existing Reflection Questions</h3>
                {questions.length > 0 ? (
                    <ul className="list-group bg-dark">
                        {questions.map((question) => (
                        <li
                            key={question.questionId}
                            className="list-group-item bg-dark d-flex justify-content-between align-items-center"
                        >
                            <span>
                                {question.questionText} (
                                <em>{question.scheduleType} - {question.scheduleValue}</em>)
                            </span>
                            <button
                                type="button"
                                className="btn text-danger"
                                onClick={() => handleRemoveQuestion(question.questionId)}
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>
                        </li>
                        ))}

                    </ul>
                ) : (
                    <p className="text-muted">No reflection questions added yet.</p>
                )}
            </section>
        </div>
    );
};
