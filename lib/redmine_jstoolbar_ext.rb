class RedmineJstoolbarExtHookListener < Redmine::Hook::ViewListener
  render_on :view_layouts_base_html_head, :partial => "redmine_jstoolbar_ext/redmine_jstoolbar_ext_partial"
end