import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { AnswerComment } from "../entities/answer-comment";

export class CommentOnAnswerEvent implements DomainEvent {
  public ocurredAt: Date;
  public answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.answerComment = answerComment;
    this.ocurredAt = new Date();
  }
  public getAggregateId() {
    console.log(this.answerComment.id);

    return this.answerComment.id;
  }
}
