import { Fragment, useEffect } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";

import Comments from "../components/comments/Comments";
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import NoQuotesFound from "../components/quotes/NoQuotesFound";
import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";



const QuoteDetail = () => {
  const match = useRouteMatch();
  const params = useParams();

  const { quoteID } = params;

  const {
    sendRequest,
    status,
    data: loadedQuotes,
    error,
  } = useHttp(getSingleQuote, true);

  useEffect(() => {
    sendRequest(quoteID);
  }, [sendRequest, quoteID]);

  if (status === "pending")
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );

  if (error) {
    return <p className="centered">{error}</p>;
  }
  if (!loadedQuotes.text) {
    return <NoQuotesFound />;
  }
  return (
    <Fragment>
      <h1>QuoteDetail Page</h1>
      <HighlightedQuote
        text={loadedQuotes.text}
        author={loadedQuotes.author}
        id={loadedQuotes.id}
      />
      <Route path={match.path} exact>
        <div className="centered">
          <Link className="btn--flat" to={`${match.url}/comments`}>
            Load Comments
          </Link>
        </div>
      </Route>
      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </Fragment>
  );
};

export default QuoteDetail;
