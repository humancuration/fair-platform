<div className="company-listing">
  <h3>{companyName}</h3>
  <p>{description}</p>
  <svg className="icon follow-company" viewBox="0 0 64 64" onClick={() => handleFollowCompany(companyId)}>
    <circle cx="32" cy="32" r="30" stroke="#FF6F61" stroke-width="4" fill="none" />
  </svg>
</div>
