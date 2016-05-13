package com.maximumgreen.c4.endpoints;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.CollectionResponse;
import com.maximumgreen.c4.C4Rating;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.HomepageHelper;
import com.maximumgreen.c4.PMF;

@Api(name = "homepageendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class HomepageEndpoint {

	@ApiMethod(name = "getComics")
	public HomepageHelper getComics() {
		PersistenceManager mgr = getPersistenceManager();
		
		HomepageHelper helper = new HomepageHelper();
		
		List<Comic> topComics = new ArrayList<Comic>();
		Query q = mgr.newQuery(Comic.class);
		q.setOrdering("rating asc");
		q.setRange(0,19);
		topComics = (List<Comic>) q.execute();
		
		helper.setTopComics(topComics);
		
		mgr.close();
		
		return helper;
		
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}