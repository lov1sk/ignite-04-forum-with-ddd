import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { QuestionComment } from "../entities/question-comment";

export class CommentOnQuestionEvent implements DomainEvent {
  public ocurredAt: Date;
  public questionComment: QuestionComment;

  constructor(questionComment: QuestionComment) {
    this.questionComment = questionComment;
    this.ocurredAt = new Date();
  }
  public getAggregateId() {
    console.log(this.questionComment.id);

    return this.questionComment.id;
  }
}
