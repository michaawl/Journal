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
            string query = "SELECT question_id, user_id, question_text, schedule_type, schedule_value FROM ReflectionQuestions WHERE user_id = @UserId";

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
            string query = "SELECT answer_id, question_id, user_id, answer_content, answer_date, is_completed FROM ReflectionAnswers WHERE question_id = @QuestionId";

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
                                reply.Answer = new ReflectionAnswer
                                {
                                    AnswerId = reader.GetInt64(0),
                                    QuestionId = reader.GetInt64(1),
                                    UserId = reader.GetInt64(2),
                                    AnswerContent = reader.GetString(3),
                                    AnswerDate = reader.GetString(4),
                                    IsCompleted = reader.GetBoolean(5)
                                };
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
    }
}
