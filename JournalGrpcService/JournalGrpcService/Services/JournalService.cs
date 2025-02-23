﻿using Grpc.Core;
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
                                    EntryId = reader.GetInt32(0),
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

        // post entry
        public override async Task<PostJournalEntryReply> PostJournalEntry(PostJournalEntryRequest request, ServerCallContext context)
        {
            string connectionString = "Server=localhost;Database=master;Integrated Security=true;";
            string query;

            if (request.EntryId > 0)
            {
                query = "UPDATE JournalEntries SET entry_title = @EntryTitle, entry_content = @EntryContent, entry_date = @EntryDate WHERE entry_id = @EntryId";
            }
            else
            {
                query = "INSERT INTO JournalEntries (user_id, entry_title, entry_content, entry_date) VALUES (@UserId, @EntryTitle, @EntryContent, @EntryDate)";
            }

            var reply = new PostJournalEntryReply();

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    _logger.LogInformation("Connection opened successfully.");

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        if (request.EntryId > 0)
                        {
                            command.Parameters.AddWithValue("@EntryId", request.EntryId);
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@UserId", request.UserId);
                        }

                        command.Parameters.AddWithValue("@EntryTitle", request.EntryTitle);
                        command.Parameters.AddWithValue("@EntryContent", request.EntryContent);
                        command.Parameters.AddWithValue("@EntryDate", request.EntryDate ?? DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));

                        await command.ExecuteNonQueryAsync();
                        reply.Message = request.EntryId > 0 ? "Journal entry updated successfully." : "Journal entry created successfully.";
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while posting the journal entry.");
                reply.Message = $"Error: {ex.Message}";
            }

            return reply;
        }

        public override Task<GetUsersReply> GetUsers(GetUsersRequest request, ServerCallContext context)
        {
            var reply = new GetUsersReply();
            return Task.FromResult(reply);
        }
    }
}
