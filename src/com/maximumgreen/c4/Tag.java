package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.*;

import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Tag {
	//Automatically generate a unique key for each tag
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key k;
	
	//Name of tag, which should be unique across the datastore
	@Persistent
	@Unique
	private String name;
	
	//List of COMIC keys tagged with this tag
	@Persistent
	private List<Key> comicsWithTag;
	
	//empty constructor
	public Tag(){
	}
}