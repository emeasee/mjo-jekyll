require 'json'

# Generate JSON represenations of all posts

module Jekyll

  class JSONIndex < Page
    def initialize(site, base, dir, name, post)
      @site = site
      @base = base
      @dir = dir
      @name = name

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'page.json')
      self.data['data'] = post
    end
  end

  class JSONIndexGenerator < Generator
    include Jekyll::Filters
    safe true
    priority :lowest
    
    def generate(site)
    
      site.posts.each_with_index do |post, index|
        jsonPost = render_json(site,post)
        
       
          filename = 'post_' + (index+1).to_s() + '.json'
          filename.sub!(/^\//, '')
          dir = '/json'
        

        site.pages << JSONIndex.new(site, site.source, dir, filename, jsonPost)
      end
    end
    
    def render_json(site, post)
      post.render( {}, site.site_payload)
      output = post.to_liquid
      hash = {
        "title" => output['title'],
        "excerpt"  => output['excerpt'] || '',
        "date" => date_to_long_string(output['date'])[0..-6],
        #"img" => output['page']['image'] || '',
        "content"  => output['content']
      }
      return hash.to_json
    end
  end

end

# Filter to output JSON data

module JsonFilter
  def json(hash)
    hash.delete('next')
    hash.delete('previous')
    hash.to_json
  end

  Liquid::Template.register_filter self
end