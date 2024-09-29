<div className="forum-thread">
  <h3>{threadTitle}</h3>
  <p>{threadPreview}</p>
  <svg className="icon follow-thread" viewBox="0 0 64 64" onClick={() => handleFollowThread(threadId)}>
    <circle cx="32" cy="32" r="30" stroke="#FF6F61" stroke-width="4" fill="none" />
  </svg>
</div>
