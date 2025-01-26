const grpcWeb = require('../proto/reflection_grpc_web_pb');
const proto = require('../proto/reflection_pb');

class ReflectionService {
  private client: any;

  constructor() {
    this.client = new grpcWeb.ReflectionClient('https://localhost:7160');
  }

  postReflectionQuestion(
    userId: number,
    questionText: string,
    scheduleType: string,
    scheduleValue: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const request = new proto.PostReflectionQuestionRequest();
      request.setUserId(userId);
      request.setQuestionText(questionText);
      request.setScheduleType(scheduleType);
      request.setScheduleValue(scheduleValue);

      this.client.postReflectionQuestion(request, {}, (err: any, response: any) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(response.toObject());
        }
      });
    });
  }

  getReflectionQuestions(userId: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = new proto.GetReflectionQuestionsRequest();
        request.setUserId(userId);

        this.client.getReflectionQuestions(request, {}, (err: any, response: any) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(response ? response.toObject() : { questions: [] });
            }
        });
    });
}

    postReflectionAnswer(
      questionId: number,
      userId: number,
      answerContent: string,
      answerDate: string,
      isCompleted: boolean
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        const request = new proto.PostReflectionAnswerRequest();
        request.setQuestionId(questionId);
        request.setUserId(userId);
        request.setAnswerContent(answerContent);
        request.setAnswerDate(answerDate);
        request.setIsCompleted(isCompleted);

        this.client.postReflectionAnswer(request, {}, (err: any, response: any) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(response.toObject());
          }
        });
      });
    }

    getReflectionAnswerByQuestionId(questionId: number): Promise<any> {
      return new Promise((resolve, reject) => {
        const request = new proto.GetReflectionAnswerByQuestionIdRequest();
        request.setQuestionId(questionId);
    
        this.client.getReflectionAnswerByQuestionId(request, {}, (err: any, response: any) => {
          if (err) {
            console.error(`Error fetching reflection answer for question ID ${questionId}:`, err);
            reject(err.message || 'Unknown error occurred while fetching reflection answer.');
          } else {
            // Log the raw response
            console.log(`Raw gRPC response for question ID ${questionId}:`, response);
            
            // Convert the response to an object
            const result = response?.toObject() || {};
        
            console.log(`Converted response object for question ID ${questionId}:`, result);
        
            if (result?.answer) {
              console.log(`Valid answer retrieved for question ID ${questionId}:`, result.answer);
              resolve(result.answer);
            } else {
              console.warn(`No valid answer found for question ID ${questionId}.`);
              resolve(null);
            }
          }
        });
      });
    }
    
    updateReflectionQuestionActiveStatus(questionId: number, active: boolean): Promise<string> {
      return new Promise((resolve, reject) => {
        const request = new proto.UpdateReflectionQuestionActiveRequest();
        request.setQuestionId(questionId);
        request.setActive(active);
    
        this.client.updateReflectionQuestionActiveStatus(request, {}, (err: any, response: any) => {
          if (err) {
            console.error(`Error updating active status for question ID ${questionId}:`, err);
            reject(err.message || 'Unknown error occurred while updating active status.');
          } else {
            console.log(`Updated active status for question ID ${questionId}:`, response.getMessage());
            resolve(response.getMessage());
          }
        });
      });
    }

getReflectionAnswersByDate(date: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = new proto.GetReflectionAnswersByDateRequest();
    request.setDate(date);

    this.client.getReflectionAnswersByDate(request, {}, (err: any, response: any) => {
      if (err) {
        console.error(`Error fetching reflection answers for date ${date}:`, err);
        reject(err.message || 'Unknown error occurred while fetching reflection answers.');
      } else {
        const result = response?.toObject() || { answersWithQuestionsList: [] };
        console.log(`Fetched reflection answers for date ${date}:`, result);
        resolve(result.answersWithQuestionsList || []); // Use the correct key here
      }
    });
  });
}
    

}

export default ReflectionService;
