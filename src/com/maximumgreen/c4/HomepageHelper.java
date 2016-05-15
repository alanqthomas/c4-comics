package com.maximumgreen.c4;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class HomepageHelper {
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	@PrimaryKey
	private Long id;
	
	@Persistent
	private List<Comic> topComics;
	
	@Persistent
	private List<Comic> popularComics;
	
	@Persistent
	private List<Comic> hotComics;
	
	@Persistent
	private List<Comic> recentComics;
	
	public HomepageHelper(){
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public List<Comic> getTopComics() {
		return topComics;
	}

	public void setTopComics(List<Comic> topComics) {
		this.topComics = topComics;
	}

	public List<Comic> getPopularComics() {
		return popularComics;
	}

	public void setPopularComics(List<Comic> popularComics) {
		this.popularComics = popularComics;
	}

	public List<Comic> getHotComics() {
		return hotComics;
	}

	public void setHotComics(List<Comic> hotComics) {
		this.hotComics = hotComics;
	}

	public List<Comic> getRecentComics() {
		return recentComics;
	}

	public void setRecentComics(List<Comic> recentComics) {
		this.recentComics = recentComics;
	}

}
