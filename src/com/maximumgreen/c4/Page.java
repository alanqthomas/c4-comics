package com.maximumgreen.c4;

import java.util.Date;

import javax.jdo.annotations.*;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.datastore.Key;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class Page {
    @PrimaryKey
    @Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Key k;
    
    //BlobKey to retrieve actual image from datastore
    @Persistent
    private BlobKey imageKey;
    
    //Date the page was created
    @Persistent
    private Date dateCreated;
    
    //empty constructor
    public Page(){
    }
}