package com.maximumgreen.c4.endpoints;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.maximumgreen.c4.Comic;
import com.maximumgreen.c4.HomepageHelper;
import com.maximumgreen.c4.PMF;

@Api(name = "homepageendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class HomepageEndpoint {

	@SuppressWarnings("unchecked")
	@ApiMethod(name = "getComics")
	public HomepageHelper getComics() {
		PersistenceManager mgr = getPersistenceManager();
		
		HomepageHelper helper = new HomepageHelper();
		Query q = mgr.newQuery(Comic.class);
		Query q2 = mgr.newQuery(Comic.class);
		q.setRange(0,19);
		
		List<Comic> topComics = new ArrayList<Comic>();
		q.setOrdering("rating desc");
		topComics = (List<Comic>) q.execute();
		helper.setTopComics(topComics);
		
		List<Comic> popularComics = new ArrayList<Comic>();
		q.setOrdering("viewCount desc");
		popularComics = (List<Comic>) q.execute();
		helper.setPopularComics(popularComics);
		
		List<Comic> recentComics = new ArrayList<Comic>();
		q.setOrdering("dateCreated desc");
		recentComics = (List<Comic>) q.execute();
		helper.setRecentComics(recentComics);
		
		List<Comic> hotComics = new ArrayList<Comic>();
		q.setOrdering("viewCount desc");
		hotComics = (List<Comic>) q2.execute();
		
		Calendar calendar = Calendar.getInstance();
		calendar.add(Calendar.DATE, -3);
		Date lastweek = calendar.getTime();
		
		List<Comic> removeMe = new ArrayList<Comic>();
		
		for (Comic c : hotComics) {
			if (c.getDateCreated().before(lastweek))
				removeMe.add(c);
		}
		
		for (Comic c : removeMe)
			hotComics.remove(c);
		
		helper.setHotComics(hotComics);
	
		mgr.close();
		
		return helper;
	}

	private static PersistenceManager getPersistenceManager() {
		return PMF.get().getPersistenceManager();
	}

}