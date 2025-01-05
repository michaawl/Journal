using Grpc.Core;
using System.Data.SqlClient;

namespace JournalGrpcService.Services
{
    public class JournalService : Journal.JournalBase
    {
        private readonly ILogger<JournalService> _logger;

        public JournalService( ILogger<JournalService> logger)
        {
            _logger = logger;
        }

        // GetJournalEntries
        public override async Task<GetJournalEntriesReply> GetJournalEntries(GetJournalEntriesRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "SELECT entry_id, entry_title, entry_content, entry_date FROM JournalEntries WHERE user_id = @UserId";

            var reply = new GetJournalEntriesReply();

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
                                reply.Entries.Add(new JournalEntryReply
                                {
                                    EntryId = reader.GetInt64(0), 
                                    EntryTitle = reader.GetString(1), 
                                    EntryContent = reader.GetString(2), 
                                    EntryDate = reader.IsDBNull(3) ? "" : reader.GetDateTime(3).ToString("yyyy-MM-dd HH:mm:ss") 
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching journal entries.");
            }

            return reply;
        }

        // Get single entry
        public override async Task<GetJournalEntryReply> GetJournalEntry(GetJournalEntryRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "SELECT entry_title, entry_content, entry_date FROM JournalEntries WHERE entry_id = @EntryId";

            var reply = new GetJournalEntryReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@EntryId", request.EntryId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                reply.EntryTitle = reader.GetString(0);
                                reply.EntryContent = reader.GetString(1);
                                reply.EntryDate = reader.GetDateTime(2).ToString("yyyy-MM-dd HH:mm:ss");
                            }
                            else
                            {
                                _logger.LogWarning("No journal entry found with ID {EntryId}", request.EntryId);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching the journal entry.");
                reply.EntryContent = $"Error: {ex.Message}";
            }

            return reply;
        }

        // post entry
        public override async Task<PostJournalEntryReply> PostJournalEntry(PostJournalEntryRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query = "INSERT INTO JournalEntries (user_id, entry_title, entry_content, entry_date) VALUES (@UserId, @EntryTitle, @EntryContent, @EntryDate)";

            var reply = new PostJournalEntryReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UserId", request.UserId);
                        command.Parameters.AddWithValue("@EntryTitle", request.EntryTitle);
                        command.Parameters.AddWithValue("@EntryContent", request.EntryContent);
                        command.Parameters.AddWithValue("@EntryDate", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));

                        await command.ExecuteNonQueryAsync();
                        reply.Message = "Journal entry created successfully.";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while creating a journal entry.");
                reply.Message = $"Error: {ex.Message}";
            }

            return reply;
        }


        public override Task<GetReflectionAnswersReply> GetReflectionAnswers(GetReflectionAnswersRequest request, ServerCallContext context)
        {
            var reply = new GetReflectionAnswersReply();
            return Task.FromResult(reply);
        }


        public override Task<GetReflectionQuestionsReply> GetReflectionQuestions(GetReflectionQuestionsRequest request, ServerCallContext context)
        {
            var reply = new GetReflectionQuestionsReply();
            return Task.FromResult(reply);
        }

        public override Task<GetUsersReply> GetUsers(GetUsersRequest request, ServerCallContext context)
        {
            var reply = new GetUsersReply();
            return Task.FromResult(reply);
        }
    }
}
