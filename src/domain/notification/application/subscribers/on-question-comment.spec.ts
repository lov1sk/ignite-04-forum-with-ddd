import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { waitFor } from "test/utils/wait-for";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { OnQuestionComment } from "./on-question-comment";
import { SpyInstance } from "vitest";

let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let answersRepository: InMemoryAnswersRepository;
let notificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

beforeEach(() => {
  questionsAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
  questionsRepository = new InMemoryQuestionsRepository(
    questionsAttachmentsRepository
  );
  questionCommentsRepository = new InMemoryQuestionCommentsRepository();
  answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
  answersRepository = new InMemoryAnswersRepository(
    answerAttachmentsRepository
  );
  notificationsRepository = new InMemoryNotificationsRepository();
  sendNotificationUseCase = new SendNotificationUseCase(
    notificationsRepository
  );
  sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

  new OnQuestionComment(sendNotificationUseCase, questionsRepository);
});

describe("On Question Comment", () => {
  it("should be able to listen a event on if a question was commented", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    // Aqui eu crio o evento
    const comment = makeQuestionComment({
      questionId: question.id,
    });
    await questionsRepository.create(question);
    // Aqui dispara o evento
    await questionCommentsRepository.create(comment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
