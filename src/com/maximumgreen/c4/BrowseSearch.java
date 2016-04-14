package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class BrowseSearch {
	@Persistent
	private List<Long> searchIds;
	
	@Persistent
	private int numResults;
	
	private List<Long> results;
	
	private boolean comics;
	
	public BrowseSearch(){
	}

	public List<Long> getSearchIds() {
		return searchIds;
	}

	public void setSearchIds(List<Long> searchIds) {
		this.searchIds = searchIds;
	}

	public int getNumResults() {
		return numResults;
	}

	public void setNumResults(int numResults) {
		this.numResults = numResults;
	}

	public List<Long> getResults() {
		return results;
	}

	public void setResults(List<Long> results) {
		this.results = results;
	}

	public boolean isComics() {
		return comics;
	}

	public void setComics(boolean comics) {
		this.comics = comics;
	}
	
}