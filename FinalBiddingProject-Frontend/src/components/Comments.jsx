//where item is listed I will have to make a comment image when the button is pressed a comment page is made on the item.
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Comments.css';

function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Track if data is being fetched

  useEffect(() => {
    // Fetch comments for the specific item
    axios
      .get(`http://localhost:5000/items/${id}/comments`)
      .then((response) => {
        setComments(response.data);
        setError(null); // Clear any errors
      })
      .catch(() => setError('Error fetching comments'))
      .finally(() => setIsFetching(false)); // Mark fetching as completed
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    axios
      .post(`http://localhost:5000/items/${id}/comments`, { text: newComment })
      .then((response) => {
        setComments([...comments, response.data]);
        setNewComment('');
        setError(null); // Clear any previous errors
      })
      .catch(() => setError('Error adding comment'));
  };

  return (
    <div className="comments-container">
      <h2 className="comments-title">Comments</h2>

      {/* Show error only if there's a real fetching error */}
      {error && isFetching && <p className="error-message">{error}</p>}


      {/* Display existing comments */}
      <div className="comments-list">
        {!isFetching && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.text}</p>
            </div>
          ))
        ) : !isFetching && comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          <p className="loading-message">Loading comments...</p>
        )}
      </div>

      {/* Add comment form */}
      <div className="add-comment-section">
        <h3>Add a Comment</h3>
        <form onSubmit={handleAddComment}>
          <textarea
            className="comment-input"
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="add-comment-button">
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
}

export default Comments;
