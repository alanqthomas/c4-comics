package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.*;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Tag {
<<<<<<< Updated upstream
	/*
	 * Tags don't need a special key/id so we'll use 
	 * the tag name to make sure they're unique
	 */
	@PrimaryKey 
	@Persistent
=======
	//Automatically generate a unique key for each tag
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key key;
	
	//Name of tag, which should be unique across the datastore
	@Persistent
	@Unique
>>>>>>> Stashed changes
	private String name;
	
	//List of COMIC keys tagged with this tag
	@Persistent
<<<<<<< Updated upstream
	private List<Key> seriesWithTag;

    //Getters and Setters
=======
	private List<Key> comicsWithTag;

    //Getters and Setters
	public Key getKey() {
		return key;
	}

	public void setKey(Key key) {
		this.key = key;
	}
	
>>>>>>> Stashed changes
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Key> getSeriesWithTag() {
<<<<<<< Updated upstream
		return seriesWithTag;
	}

	public void setSeriesWithTag(List<Key> seriesWithTag) {
		this.seriesWithTag = seriesWithTag;
	}
=======
		return comicsWithTag;
	}

	public void setSeriesWithTag(List<Key> seriesWithTag) {
		this.comicsWithTag = seriesWithTag;
	}

>>>>>>> Stashed changes
}