import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from "../use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { waitFor } from "test/utils/wait-for";
import { SpyInstance, describe } from "vitest";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { OnAnswerComment } from "./on-answer-comment";

let questionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let questionsRepository: InMemoryQuestionsRepository;
let answerCommentsRepository: InMemoryAnswerCommentsRepository;
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
  answerCommentsRepository = new InMemoryAnswerCommentsRepository();
  answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
  answersRepository = new InMemoryAnswersRepository(
    answerAttachmentsRepository
  );
  notificationsRepository = new InMemoryNotificationsRepository();
  sendNotificationUseCase = new SendNotificationUseCase(
    notificationsRepository
  );
  sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, "execute");

  new OnAnswerComment(sendNotificationUseCase, answersRepository);
});

describe("On Answer Comment", () => {
  it("should be able to listen a event on if a answer was commented", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));
    const answer = makeAnswer(
      { questionId: question.id },
      new UniqueEntityID("question-1")
    );

    // Aqui eu crio o evento
    const answerComment = makeAnswerComment({
      answerId: answer.id,
    });
    await questionsRepository.create(question);
    await answersRepository.create(answer);
    // Aqui dispara o evento
    await answerCommentsRepository.create(answerComment);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
