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
}

export default ReflectionService;
