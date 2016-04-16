package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class SearchHelper {
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey
	private Long id;
	
	@Persistent
	private String input;
	
	@Persistent
	private List<C4User> authorResults;
	
	@Persistent
	private List<Series> seriesResults;
	
	@Persistent
	private List<Comic> comicResults;
	
	@Persistent
	private List<Tag> tagResults;
	
	public SearchHelper(){
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getInput() {
		return input;
	}

	public void setInput(String input) {
		this.input = input;
	}

	public List<C4User> getAuthorResults() {
		return authorResults;
	}

	public void setAuthorResults(List<C4User> authorResults) {
		this.authorResults = authorResults;
	}

	public List<Series> getSeriesResults() {
		return seriesResults;
	}

	public void setSeriesResults(List<Series> seriesResults) {
		this.seriesResults = seriesResults;
	}

	public List<Comic> getComicResults() {
		return comicResults;
	}

	public void setComicResults(List<Comic> comicResults) {
		this.comicResults = comicResults;
	}

	public List<Tag> getTagResults() {
		return tagResults;
	}

	public void setTagResults(List<Tag> tagResults) {
		this.tagResults = tagResults;
	}

}