package com.maximumgreen.c4.endpoints;

import com.maximumgreen.c4.PMF;
import com.maximumgreen.c4.C4User;
import com.maximumgreen.c4.Series;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.NotFoundException;
import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.datanucleus.query.JDOCursorHelper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.lang.Long;

import javax.annotation.Nullable;
import javax.inject.Named;
import javax.persistence.EntityNotFoundException;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

@Api(name = "c4userendpoint", namespace = @ApiNamespace(ownerDomain = "maximumgreen.com", ownerName = "maximumgreen.com", packagePath = "c4"))
public class BrowseEndpoint {
	

}
