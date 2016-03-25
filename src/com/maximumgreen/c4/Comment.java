package com.maximumgreen.c4;

import java.util.Date;

import javax.jdo.annotations.*;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Comment {
    //Auto-generate an id number for each comment
	@PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
    
	//User that made the comment
    @Persistent
    private String user;
    
    //Comment text
    @Persistent
    private String comment;
    
    //Date the comment was posted
    @Persistent
    private Date date;
    
    //empty constructor
    public Comment(){
    }
}