import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";

import classes from "./Comments.module.css";
import NewCommentForm from "./NewCommentForm";
import useHttp from "../../hooks/use-http";
import { getAllComments } from "../../lib/api";
import LoadingSpinner from "../UI/LoadingSpinner";
import CommentsList from "./CommentsList";
const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params = useParams();

  const quoteID = params.quoteID;

  const {
    sendRequest,
    data: loadedData,
    status,
  } = useHttp(getAllComments);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };

  useEffect(() => {
    sendRequest(quoteID);
  }, [quoteID, sendRequest]);

  let comments;

  if (status === "pending") {
    comments = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && loadedData && loadedData.length > 0) {
    comments = <CommentsList comments={loadedData} />;
  }

  if (status === "completed" && loadedData && loadedData.length === 0) {
    comments = <p className="centered">No comments were add yet!</p>;
  }

  const onAddedCommentHandler = useCallback(()=>{
    sendRequest(quoteID)
  },[sendRequest,quoteID])

  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          onAddedComment={onAddedCommentHandler}
          quoteID={quoteID}
        />
      )}
      {comments}
    </section>
  );
};

export default Comments;
