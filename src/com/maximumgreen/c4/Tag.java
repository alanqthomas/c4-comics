package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.*;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Tag {
	/*
	 * Tags don't need a special key/id so we'll use 
	 * the tag name to make sure they're unique
	 */
	@PrimaryKey 
	@Persistent
	private String name;
	
	//List of COMIC keys tagged with this tag
	@Persistent
	private List<Key> seriesWithTag;

	//Empty constructor
	public Tag() {
	}

    //Getters and Setters
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Key> getSeriesWithTag() {
		return seriesWithTag;
	}

	public void setSeriesWithTag(List<Key> seriesWithTag) {
		this.seriesWithTag = seriesWithTag;
	}
}