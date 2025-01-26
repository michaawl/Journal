using Grpc.Core;
using Microsoft.Extensions.Logging;
using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ReflectionGrpcService;
using System.Globalization;

namespace JournalGrpcService.Services
{
    public class ReflectionService : Reflection.ReflectionBase
    {
        private readonly ILogger<ReflectionService> _logger;

        public ReflectionService(ILogger<ReflectionService> logger)
        {
            _logger = logger;
        }

        // Get all reflection questions for a user
        public override async Task<GetReflectionQuestionsReply> GetReflectionQuestions(GetReflectionQuestionsRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = @"
        SELECT question_id, user_id, question_text, schedule_type, schedule_value 
        FROM ReflectionQuestions 
        WHERE user_id = @UserId AND active = 1"; // Only include active questions

            var reply = new GetReflectionQuestionsReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UserId", request.UserId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                reply.Questions.Add(new ReflectionQuestion
                                {
                                    QuestionId = reader.GetInt64(0),
                                    UserId = reader.GetInt64(1),
                                    QuestionText = reader.GetString(2),
                                    ScheduleType = reader.GetString(3),
                                    ScheduleValue = reader.GetDateTime(4).ToString("yyyy-MM-dd")
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching reflection questions.");
            }

            return reply;
        }



        // Get a specific reflection question by its ID
        public override async Task<GetReflectionQuestionByIdReply> GetReflectionQuestionById(GetReflectionQuestionByIdRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "SELECT question_id, user_id, question_text, schedule_type, schedule_value FROM ReflectionQuestions WHERE question_id = @QuestionId";

            var reply = new GetReflectionQuestionByIdReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@QuestionId", request.QuestionId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                reply.Question = new ReflectionQuestion
                                {
                                    QuestionId = reader.GetInt64(0),
                                    UserId = reader.GetInt64(1),
                                    QuestionText = reader.GetString(2),
                                    ScheduleType = reader.GetString(3),
                                    ScheduleValue = reader.GetString(4)
                                };
                            }
                            else
                            {
                                _logger.LogWarning("No reflection question found with ID {QuestionId}", request.QuestionId);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching the reflection question.");
            }

            return reply;
        }

        // Get an answer to a reflection question by question ID
        public override async Task<GetReflectionAnswerByQuestionIdReply> GetReflectionAnswerByQuestionId(GetReflectionAnswerByQuestionIdRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = @"
        SELECT TOP 1 
            answer_id, question_id, user_id, answer_content, answer_date, is_completed
        FROM ReflectionAnswers 
        WHERE question_id = @QuestionId
        ORDER BY answer_date DESC";

            var reply = new GetReflectionAnswerByQuestionIdReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@QuestionId", request.QuestionId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                // Fetch answer_date as DateTime and format it as a string
                                DateTime answerDate = reader.GetDateTime(4);

                                reply.Answer = new ReflectionAnswer
                                {
                                    AnswerId = reader.GetInt32(0),
                                    QuestionId = reader.GetInt32(1),
                                    UserId = reader.GetInt32(2),
                                    AnswerContent = reader.GetString(3),
                                    AnswerDate = answerDate.ToString("yyyy-MM-dd"), // Format the DateTime to string
                                    IsCompleted = reader.GetBoolean(5)
                                };

                                _logger.LogInformation(
                                    "Answer retrieved for question ID {QuestionId}: Answer ID {AnswerId}, User ID {UserId}, Date {AnswerDate}, Is Completed {IsCompleted}",
                                    reply.Answer.QuestionId,
                                    reply.Answer.AnswerId,
                                    reply.Answer.UserId,
                                    reply.Answer.AnswerDate,
                                    reply.Answer.IsCompleted
                                );
                            }
                            else
                            {
                                _logger.LogWarning("No reflection answer found with question ID {QuestionId}", request.QuestionId);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching the reflection answer.");
            }

            return reply;
        }


        // Post a new reflection question
        public override async Task<PostReflectionQuestionReply> PostReflectionQuestion(PostReflectionQuestionRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "INSERT INTO ReflectionQuestions (user_id, question_text, schedule_type, schedule_value) VALUES (@UserId, @QuestionText, @ScheduleType, @ScheduleValue)";

            var reply = new PostReflectionQuestionReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UserId", request.UserId);
                        command.Parameters.AddWithValue("@QuestionText", request.QuestionText);
                        command.Parameters.AddWithValue("@ScheduleType", request.ScheduleType);

                        // Parse ScheduleValue from dd.M.yyyy format
                        if (!DateTime.TryParseExact(request.ScheduleValue, "d.M.yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
                        {
                            throw new ArgumentException("Invalid date format for ScheduleValue. Expected format is dd.M.yyyy.");
                        }

                        // Pass only the date portion to the database
                        command.Parameters.AddWithValue("@ScheduleValue", parsedDate.Date);

                        await command.ExecuteNonQueryAsync();
                        reply.Message = "Reflection question posted successfully.";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while posting the reflection question.");
                reply.Message = $"Error: {ex.Message}";
            }

            return reply;
        }



        // Post an answer to a reflection question
        public override async Task<PostReflectionAnswerReply> PostReflectionAnswer(PostReflectionAnswerRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "INSERT INTO ReflectionAnswers (question_id, user_id, answer_content, answer_date, is_completed) VALUES (@QuestionId, @UserId, @AnswerContent, @AnswerDate, @IsCompleted)";

            var reply = new PostReflectionAnswerReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@QuestionId", request.QuestionId);
                        command.Parameters.AddWithValue("@UserId", request.UserId);
                        command.Parameters.AddWithValue("@AnswerContent", request.AnswerContent);
                        command.Parameters.AddWithValue("@AnswerDate", request.AnswerDate ?? DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));
                        command.Parameters.AddWithValue("@IsCompleted", request.IsCompleted);

                        await command.ExecuteNonQueryAsync();
                        reply.Message = "Reflection answer posted successfully.";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while posting the reflection answer.");
                reply.Message = $"Error: {ex.Message}";
            }

            return reply;
        }

        public override async Task<UpdateReflectionQuestionActiveReply> UpdateReflectionQuestionActiveStatus(UpdateReflectionQuestionActiveRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = @"
        UPDATE ReflectionQuestions
        SET active = @Active
        WHERE question_id = @QuestionId";

            var reply = new UpdateReflectionQuestionActiveReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@QuestionId", request.QuestionId);
                        command.Parameters.AddWithValue("@Active", request.Active);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected > 0)
                        {
                            reply.Message = $"Successfully updated the active status to {request.Active} for question ID {request.QuestionId}.";
                            _logger.LogInformation("Updated active status to {Active} for question ID {QuestionId}.", request.Active, request.QuestionId);
                        }
                        else
                        {
                            reply.Message = "No question found with the given ID.";
                            _logger.LogWarning("No question found with ID {QuestionId}.", request.QuestionId);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while updating the active status of the question.");
                reply.Message = $"Error: {ex.Message}";
            }

            return reply;
        }

        public override async Task<GetReflectionAnswersByDateReply> GetReflectionAnswersByDate(GetReflectionAnswersByDateRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = @"
        SELECT 
            a.answer_id, a.question_id, a.user_id, a.answer_content, a.answer_date, a.is_completed,
            q.question_id, q.user_id, q.question_text, q.schedule_type, q.schedule_value
        FROM ReflectionAnswers a
        INNER JOIN ReflectionQuestions q ON a.question_id = q.question_id
        WHERE CAST(a.answer_date AS DATE) = @Date";

            var reply = new GetReflectionAnswersByDateReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@Date", request.Date);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                // Populate ReflectionAnswer
                                var answer = new ReflectionAnswer
                                {
                                    AnswerId = reader.GetInt32(0), // Use GetInt64 for BIGINT
                                    QuestionId = reader.GetInt32(1), // Use GetInt64 for BIGINT
                                    UserId = reader.GetInt32(2), // Use GetInt64 for BIGINT
                                    AnswerContent = reader.GetString(3),
                                    AnswerDate = reader.GetDateTime(4).ToString("yyyy-MM-dd"),
                                    IsCompleted = reader.GetBoolean(5)
                                };

                                // Populate ReflectionQuestion
                                var question = new ReflectionQuestion
                                {
                                    QuestionId = reader.GetInt64(6), // Use GetInt64 for BIGINT
                                    UserId = reader.GetInt64(7), // Use GetInt64 for BIGINT
                                    QuestionText = reader.GetString(8),
                                    ScheduleType = reader.GetString(9),
                                    ScheduleValue = reader.GetDateTime(10).ToString("yyyy-MM-dd")
                                };

                                // Add the combined object to the reply
                                reply.AnswersWithQuestions.Add(new ReflectionAnswerWithQuestion
                                {
                                    Answer = answer,
                                    Question = question
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching reflection answers for date {Date}.", request.Date);
            }

            return reply;
        }

    }
}
