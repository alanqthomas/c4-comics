package com.maximumgreen.c4;

import java.util.Date;
import java.util.List;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Series {
	//Series key should contain key of parent User
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key k;
	
	//Title of Series
	@Persistent
	private String title;
	
	//Series description
	@Persistent
	private String description;
	
	//Background image used on Series page
	@Persistent
	private BlobKey bgImage;
	
	//Date the SERIES was created
	@Persistent 
	private Date dateCreated;
	
	//SERIES rating, to be calculated from their COMICS ratings
	@Persistent
	private double rating;
	
	//List of COMIC keys within the series. Series -> Comics -> Pages
	@Persistent 
	private List<Key> comics;
	
	//List of USER keys subscribed to this series
	@Persistent
	private List<Key> subscribers;
	
	//List of COMMENTS for the series as a whole
	@Persistent
	private List<Comment> comments;
	
	//empty constructor
	public Series(){
	}
	
}