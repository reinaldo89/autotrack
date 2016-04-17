/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var assert = require('assert');
var ga = require('./analytics');


describe('index', function() {

  afterEach(function() {
    browser
        .execute(ga.clearHitData)
        .execute(ga.run, 'eventTracker:remove')
        .execute(ga.run, 'mediaQueryTracker:remove')
        .execute(ga.run, 'outboundFormTracker:remove')
        .execute(ga.run, 'outboundLinkTracker:remove')
        .execute(ga.run, 'socialTracker:remove')
        .execute(ga.run, 'urlChangeTracker:remove')
        .execute(ga.run, 'remove');
  });


  it('should provide all plugins', function() {

    var gaplugins = browser
        .url('/test/autotrack.html')
        .execute(ga.getProvidedPlugins)
        .value;

    assert(gaplugins.Autotrack);
    assert(gaplugins.EventTracker);
    assert(gaplugins.MediaQueryTracker);
    assert(gaplugins.OutboundFormTracker);
    assert(gaplugins.OutboundLinkTracker);
    assert(gaplugins.SocialTracker);
    assert(gaplugins.UrlChangeTracker);
  });


  it('should provide plugins even if sourced before the tracking snippet',
      function() {

    var gaplugins = browser
        .url('/test/autotrack-reorder.html')
        .execute(ga.getProvidedPlugins)
        .value;

    assert(gaplugins.Autotrack);
    assert(gaplugins.EventTracker);
    assert(gaplugins.MediaQueryTracker);
    assert(gaplugins.OutboundFormTracker);
    assert(gaplugins.OutboundLinkTracker);
    assert(gaplugins.SocialTracker);
    assert(gaplugins.UrlChangeTracker);
  });


  it('should work with all plugins required', function() {

    var hitData = browser
        .url('/test/autotrack.html')
        .execute(ga.run, 'create', 'UA-XXXXX-Y', 'auto')
        .execute(ga.trackHitData)
        .execute(ga.run, 'require', 'eventTracker')
        .execute(ga.run, 'require', 'outboundLinkTracker')
        .execute(ga.run, 'require', 'mediaQueryTracker')
        .execute(ga.run, 'require', 'outboundFormTracker')
        .execute(ga.run, 'require', 'socialTracker')
        .execute(ga.run, 'require', 'urlChangeTracker')
        .execute(ga.run, 'send', 'pageview')
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 1);
  });


  it('should work with renaming the global object', function() {

    var hitData = browser
        .url('/test/autotrack-rename.html')
        .execute(ga.run, 'create', 'UA-XXXXX-Y', 'auto')
        .execute(ga.trackHitData)
        .execute(ga.run, 'require', 'eventTracker')
        .execute(ga.run, 'require', 'outboundLinkTracker')
        .execute(ga.run, 'require', 'mediaQueryTracker')
        .execute(ga.run, 'require', 'outboundFormTracker')
        .execute(ga.run, 'require', 'socialTracker')
        .execute(ga.run, 'require', 'urlChangeTracker')
        .execute(ga.run, 'send', 'pageview')
        .execute(ga.getHitData)
        .value;

    assert.equal(hitData.length, 1);
  });

});
