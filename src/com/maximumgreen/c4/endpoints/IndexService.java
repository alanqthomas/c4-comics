package com.maximumgreen.c4.endpoints;

import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.StatusCode;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.Tag;

import java.util.List;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;

public class IndexService {
	
	public static final String USER = "user";
	public static final String SERIES = "series";
	public static final String COMIC = "comic";	
	public static final String TAG = "tag";
	
	private final static Logger log = Logger.getLogger(IndexService.class.getName());
	
	public IndexService(){}
	
	public static void indexDocument(String indexName, Document document){
		Index index = getIndex(indexName);
		
		try{
			index.put(document);
			log.info("Document inserted with id:" + document.getId());
		} catch (PutException e){
			if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())){
				// retry putting the document
				index.put(document);
				log.info("Document inserted on retry with id:" + document.getId());
			}
		}
	}
	
	public static Index getIndex(String indexName){
		IndexSpec indexSpec = IndexSpec.newBuilder().setName(indexName).build();
		Index index = SearchServiceFactory.getSearchService().getIndex(indexSpec);
		return index;
	}
	
	public static void removeDocument(String indexName, String id){
		log.info("indexName: " + indexName);
		log.info("id: " + id);
		Index index = getIndex(indexName);		
		index.delete(id);
		log.info("Document deleted");
	}
	
	public static String buildTagString(List<Long> tags) throws NotFoundException{
		PersistenceManager mgr = PMF.get().getPersistenceManager();
		String tagString = "";
		
		if(tags == null){
			return tagString;
		}
		
		if(tags.isEmpty()){
			return tagString;
		}
		
		try{
			Tag tag = null;
			for(Long id : tags){				
					tag = mgr.getObjectById(Tag.class, id);
					tagString.concat(tag.getName());	
					tagString.concat(" ");
			}
			
		} catch (javax.jdo.JDOObjectNotFoundException e){
			throw new NotFoundException("Tag does not exist");
		} finally {
			mgr.close();
		}
		
		return tagString;
	}
}
