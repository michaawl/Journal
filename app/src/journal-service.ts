const grpcWeb = require('./proto/journal_grpc_web_pb');
const proto = require('./proto/journal_pb');

class JournalService {
  private client: any;

  constructor() {
    this.client = new grpcWeb.JournalClient('https://localhost:7160');
  }

  getJournalEntries(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new proto.GetJournalEntriesRequest();
      request.setUserId(userId);

      this.client.getJournalEntries(request, {}, (err: any, response: any) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  getJournalEntry(entryId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new proto.GetJournalEntryRequest();
      request.setEntryId(entryId);

      this.client.getJournalEntry(request, {}, (err: any, response: any) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  postJournalEntry(userId: number, title: string, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new proto.PostJournalEntryRequest();
      request.setUserId(userId);
      request.setEntryTitle(title);
      request.setEntryContent(content);

      this.client.postJournalEntry(request, {}, (err: any, response: any) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }
}

export default JournalService;
